// Mede o portfólio com o Lighthouse (3 execuções Mobile + 3 Desktop) e gera a tabela de medianas.
//
// Uso:   node scripts/medir.mjs <pasta-dist> <pasta-de-saida> [rotulo]
// Ex.:   npm run build && node scripts/medir.mjs dist docs/relatorios/depois depois
//
// Com URL=<endereço>, não sobe servidor: mede o site publicado.
// Ex.:   URL=https://kmpc2013.github.io/portifolio/ node scripts/medir.mjs - docs/relatorios/producao-antes producao
//
// Com --resumir, não mede: só recalcula o resumo a partir dos relatórios HTML já salvos.
// Ex.:   node scripts/medir.mjs --resumir docs/relatorios/antes antes
//
// A pasta é servida com `serve` em http://localhost:3000 (gzip ligado, como no GitHub Pages).
// Outra porta: PORTA=3010 node scripts/medir.mjs ...  A porta precisa estar livre.
// Precisa de um Chrome/Edge instalado; defina CHROME_PATH se ele não for encontrado sozinho.
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const LIGHTHOUSE = 'lighthouse@13.5.0'
const args = process.argv.slice(2)
const soResumir = args[0] === '--resumir'
if (soResumir) args.shift()
const [raiz = 'dist', saida = 'docs/relatorios/medicao', rotulo = 'medicao'] = soResumir ? ['', ...args] : args
const PORTA = process.env.PORTA ?? '3000'
const remoto = Boolean(process.env.URL)
const URL = process.env.URL ?? `http://localhost:${PORTA}/`
const EXECUCOES = 3
const PRESETS = ['mobile', 'desktop']

mkdirSync(saida, { recursive: true })

// Se já houver algo na porta, mediríamos a página errada sem perceber.
const sobeServidor = !soResumir && !remoto
if (sobeServidor && (await responde()))
  throw new Error(`A porta ${PORTA} já está em uso: feche o servidor ou use PORTA=<outra>`)

const servidor = sobeServidor
  ? spawn('npx', ['serve', resolve(raiz), '-l', PORTA, '--no-clipboard'], { shell: true, stdio: 'ignore' })
  : null
if (servidor) await esperarServidor()

const resultados = {}
try {
  for (const preset of PRESETS) {
    resultados[preset] = []
    for (let i = 1; i <= EXECUCOES; i++) {
      const base = join(saida, `${rotulo}-${preset}-${i}`)
      if (!soResumir) {
        console.log(`Lighthouse ${preset} ${i}/${EXECUCOES}...`)
        execFileSync(
          'npx',
          [
            '--yes',
            LIGHTHOUSE,
            URL,
            '--output=html',
            `--output-path=${base}.report.html`,
            '--only-categories=performance,accessibility,best-practices,seo',
            '--chrome-flags=--headless=new',
            '--quiet',
            ...(preset === 'desktop' ? ['--preset=desktop'] : []),
          ],
          { shell: true, stdio: 'inherit' },
        )
      }
      // O relatório HTML embute o JSON completo do Lighthouse.
      const html = readFileSync(`${base}.report.html`, 'utf8')
      resultados[preset].push({
        arquivo: `${base}.report.html`,
        ...extrair(JSON.parse(html.match(/__LIGHTHOUSE_JSON__ = (.*?);<\/script>/s)[1])),
      })
    }
  }
} finally {
  if (servidor && process.platform === 'win32')
    execFileSync('taskkill', ['/pid', String(servidor.pid), '/T', '/F'], { stdio: 'ignore' })
  else servidor?.kill()
}

const medianas = Object.fromEntries(PRESETS.map((p) => [p, medianaPorMetrica(resultados[p])]))
writeFileSync(
  join(saida, 'resumo.json'),
  JSON.stringify(
    { rotulo, url: URL, lighthouse: LIGHTHOUSE, data: new Date().toISOString(), resultados, medianas },
    null,
    2,
  ),
)
writeFileSync(join(saida, 'resumo.md'), tabela(medianas))
console.log(tabela(medianas))

function extrair(r) {
  const a = r.audits
  const lcp = a['lcp-breakdown-insight']?.details?.items ?? []
  // Auditorias pontuadas que não passaram (as informativas não entram na nota)
  const reprovadas = Object.entries(r.categories).flatMap(([categoria, c]) =>
    c.auditRefs
      .filter((ref) => ref.weight > 0 || categoria === 'performance')
      .map((ref) => a[ref.id])
      .filter(
        (x) =>
          x.score !== null && x.score < 0.9 && !['informative', 'notApplicable', 'manual'].includes(x.scoreDisplayMode),
      )
      .map((x) => ({ categoria, id: x.id, titulo: x.title, valor: x.displayValue ?? '' })),
  )
  return {
    performance: Math.round(r.categories.performance.score * 100),
    acessibilidade: Math.round(r.categories.accessibility.score * 100),
    boasPraticas: Math.round(r.categories['best-practices'].score * 100),
    seo: Math.round(r.categories.seo.score * 100),
    fcp: a['first-contentful-paint'].numericValue,
    lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
    si: a['speed-index'].numericValue,
    pesoKB: a['total-byte-weight'].numericValue / 1024,
    requisicoes: a['network-requests'].details.items.length,
    trabalhoJsMs: a['bootup-time']?.numericValue ?? 0,
    elementoLcp: lcp.find((item) => item.type === 'node')?.snippet ?? '',
    fasesLcp:
      lcp.find((item) => item.type === 'table')?.items?.map((f) => ({ fase: f.label ?? f.subpart, ms: f.duration })) ??
      [],
    listaRequisicoes: a['network-requests'].details.items.map((x) => ({
      url: x.url,
      tipo: x.resourceType ?? '',
      kb: (x.transferSize ?? 0) / 1024,
      prioridade: x.priority ?? '',
    })),
    reprovadas,
    navegador: r.environment.hostUserAgent,
    versao: r.lighthouseVersion,
  }
}

function medianaPorMetrica(execucoes) {
  // A execução mediana pela nota de Performance é guardada inteira (para listas e fases do LCP)
  const porNota = [...execucoes].sort((x, y) => x.performance - y.performance)
  const m = { execucaoMediana: porNota[Math.floor(porNota.length / 2)].arquivo }
  for (const chave of Object.keys(execucoes[0])) {
    const valores = execucoes.map((e) => e[chave])
    if (typeof valores[0] !== 'number') {
      m[chave] = porNota[Math.floor(porNota.length / 2)][chave]
      continue
    }
    const ordenados = [...valores].sort((x, y) => x - y)
    m[chave] = ordenados[Math.floor(ordenados.length / 2)]
  }
  return m
}

function tabela(med) {
  const s = (ms) => `${(ms / 1000).toFixed(2).replace('.', ',')} s`
  const linhas = [
    ['Performance', (m) => m.performance],
    ['Acessibilidade', (m) => m.acessibilidade],
    ['Boas práticas', (m) => m.boasPraticas],
    ['SEO', (m) => m.seo],
    ['FCP', (m) => s(m.fcp)],
    ['LCP', (m) => s(m.lcp)],
    ['TBT', (m) => `${Math.round(m.tbt)} ms`],
    ['CLS', (m) => m.cls.toFixed(3).replace('.', ',')],
    ['Speed Index', (m) => s(m.si)],
    ['Peso total', (m) => `${m.pesoKB.toFixed(1).replace('.', ',')} KB`],
    ['Requisições', (m) => m.requisicoes],
  ]
  return [
    `Medianas de ${EXECUCOES} execuções — ${rotulo}\n`,
    '| Métrica | Mobile | Desktop |',
    '|---|---|---|',
    ...linhas.map(([nome, f]) => `| ${nome} | ${f(med.mobile)} | ${f(med.desktop)} |`),
    '',
  ].join('\n')
}

async function responde() {
  try {
    return (await fetch(URL)).ok
  } catch {
    return false
  }
}

async function esperarServidor() {
  for (let i = 0; i < 60; i++) {
    if (await responde()) return
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`O servidor não subiu em ${URL}`)
}

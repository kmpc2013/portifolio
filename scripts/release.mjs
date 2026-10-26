// Calcula a próxima versão e escreve as notas da release a partir dos commits desde a última tag.
//
// Uso:   node scripts/release.mjs <arquivo-de-notas>
// Ex.:   node scripts/release.mjs notas-release.md
//
// A versão segue os Conventional Commits:
//   feat!: ... ou "BREAKING CHANGE" no corpo  -> major (2.0.0 -> 3.0.0)
//   feat: ...                                 -> minor (2.0.0 -> 2.1.0)
//   fix:, perf:, outros tipos ou sem prefixo  -> patch (2.0.0 -> 2.0.1)
//
// docs, ci, chore, test, style e refactor não geram release sozinhos: como a tag não avança,
// eles entram nas notas da próxima versão que tiver uma mudança real.
//
// No GitHub Actions, a versão sai em GITHUB_OUTPUT (versao=v2.1.0). Sem release a criar, não sai nada.
// Fora do Actions, só imprime a versão e as notas: serve para conferir antes de dar push.
import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Ordem das seções nas notas; tipos fora daqui (e commits sem prefixo) vão para "Outras mudanças"
const SECOES = [
  { tipos: ['feat'], titulo: 'Novidades' },
  { tipos: ['fix'], titulo: 'Correções' },
  { tipos: ['perf'], titulo: 'Desempenho' },
]
const OUTRAS = 'Outras mudanças'

// Tipos que não mudam o site publicado: só entram de carona na próxima release
const SEM_RELEASE = ['docs', 'ci', 'chore', 'test', 'style', 'refactor']

// "feat(contato)!: valida e-mail" -> { tipo: 'feat', escopo: 'contato', quebra: true, descricao: 'valida e-mail' }
export function lerCommit({ hash, assunto, corpo = '' }) {
  const partes = assunto.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/)
  const quebra = Boolean(partes?.[3]) || /BREAKING[ -]CHANGE/.test(corpo)
  if (!partes) return { hash, tipo: null, escopo: null, quebra, descricao: assunto }
  return { hash, tipo: partes[1].toLowerCase(), escopo: partes[2] ?? null, quebra, descricao: partes[4] }
}

// Quebra de compatibilidade sempre gera release, mesmo vinda de um refactor!
export function geraRelease(commits) {
  return commits.some((c) => c.quebra || !SEM_RELEASE.includes(c.tipo))
}

// null quando nenhum commit gera release
export function proximaVersao(atual, commits) {
  if (!geraRelease(commits)) return null
  const [major, minor, patch] = atual.replace(/^v/, '').split('.').map(Number)
  if (commits.some((c) => c.quebra)) return `v${major + 1}.0.0`
  if (commits.some((c) => c.tipo === 'feat')) return `v${major}.${minor + 1}.0`
  return `v${major}.${minor}.${patch + 1}`
}

export function montarNotas({ commits, anterior, versao, repositorio, site }) {
  const linha = (c) => {
    const texto = c.descricao.charAt(0).toUpperCase() + c.descricao.slice(1)
    const escopo = c.escopo ? ` (${c.escopo})` : ''
    const link = repositorio ? ` ([${c.hash.slice(0, 7)}](${repositorio}/commit/${c.hash}))` : ''
    return `- ${texto}${escopo}${link}`
  }

  const grupos = new Map([...SECOES.map((s) => [s.titulo, []]), [OUTRAS, []]])
  for (const c of commits) {
    const secao = SECOES.find((s) => s.tipos.includes(c.tipo))
    grupos.get(secao?.titulo ?? OUTRAS).push(c)
  }

  const blocos = []
  if (site) blocos.push(`Versão publicada em ${site}`)
  const quebras = commits.filter((c) => c.quebra)
  if (quebras.length) blocos.push(`### Mudanças que quebram compatibilidade\n\n${quebras.map(linha).join('\n')}`)
  for (const [titulo, lista] of grupos) {
    if (lista.length) blocos.push(`### ${titulo}\n\n${lista.map(linha).join('\n')}`)
  }
  if (repositorio && anterior) blocos.push(`**Todas as mudanças:** ${repositorio}/compare/${anterior}...${versao}`)
  return blocos.join('\n\n') + '\n'
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

// Última tag vX.Y.Z alcançável a partir do commit atual; sem nenhuma, começa do zero
function ultimaTag() {
  try {
    return git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*')
  } catch {
    return null
  }
}

// Merges ficam de fora: os commits do branch já entram um a um
function commitsDesde(tag) {
  const SEP_CAMPO = '\x1f'
  const SEP_COMMIT = '\x1e'
  const saida = git(
    'log',
    '--no-merges',
    `--format=%H${SEP_CAMPO}%s${SEP_CAMPO}%b${SEP_COMMIT}`,
    tag ? `${tag}..HEAD` : 'HEAD',
  )
  return saida
    .split(SEP_COMMIT)
    .map((bloco) => bloco.trim())
    .filter(Boolean)
    .map((bloco) => {
      const [hash, assunto, corpo] = bloco.split(SEP_CAMPO)
      return lerCommit({ hash, assunto, corpo })
    })
}

function principal() {
  const arquivo = process.argv[2] ?? 'notas-release.md'
  const anterior = ultimaTag()
  const commits = commitsDesde(anterior)
  if (!commits.length) {
    console.log(`Nenhum commit novo desde ${anterior}: nada a publicar.`)
    return
  }

  const versao = proximaVersao(anterior ?? 'v0.0.0', commits)
  if (!versao) {
    console.log(`${commits.length} commits desde ${anterior}, nenhum de feat/fix/perf: ficam para a próxima release.`)
    return
  }
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_OUTPUT, SITE_URL } = process.env
  const repositorio = GITHUB_REPOSITORY ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}` : null
  const notas = montarNotas({ commits, anterior, versao, repositorio, site: SITE_URL })

  writeFileSync(arquivo, notas)
  if (GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT, `versao=${versao}\n`)
  console.log(`${anterior ?? '(sem tag)'} -> ${versao} (${commits.length} commits)\n\n${notas}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) principal()

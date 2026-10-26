// Funções puras que transformam os dados do site no conteúdo do currículo em PDF.
// Ficam separadas do layout (Curriculo.jsx) para poderem ser testadas sem gerar o PDF.

// A Helvetica embutida no PDF só tem os caracteres do WinAnsi: o sinal de menos (−) e o
// espaço fino viram quadradinho. Troca pelos equivalentes que ela tem.
const SUBSTITUICOES = [
  [/−/g, '-'],
  [/[  ]/g, ' '],
]

export function textoPdf(texto) {
  return SUBSTITUICOES.reduce((acc, [de, para]) => acc.replace(de, para), texto)
}

// "https://www.linkedin.com/in/fulano/" -> "linkedin.com/in/fulano": o texto do link precisa
// ser legível, porque o ATS lê o texto e não o destino do link
export function urlCurta(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

// Cargos seguidos na mesma empresa viram um bloco só, com o período total em cima:
// o recrutador vê o tempo de casa e a evolução de júnior a sênior de uma vez.
// Os dados vêm do mais recente para o mais antigo, com períodos no formato "inicio – fim".
export function agruparPorEmpresa(experiencia) {
  const grupos = []
  for (const item of experiencia) {
    const ultimo = grupos.at(-1)
    if (ultimo?.empresa === item.empresa) ultimo.cargos.push(item)
    else grupos.push({ empresa: item.empresa, cargos: [item] })
  }

  return grupos.map((grupo) => {
    const fim = grupo.cargos[0].periodo.split(' – ')[1]
    const inicio = grupo.cargos.at(-1).periodo.split(' – ')[0]
    return { ...grupo, periodo: `${inicio} – ${fim}` }
  })
}

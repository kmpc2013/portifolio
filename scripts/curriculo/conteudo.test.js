import { describe, expect, it } from 'vitest'
import { agruparPorEmpresa, textoPdf, urlCurta } from './conteudo.js'

describe('textoPdf', () => {
  it('troca o sinal de menos, que a Helvetica do PDF não tem', () => {
    expect(textoPdf('−70% de ruído')).toBe('-70% de ruído')
  })
})

describe('urlCurta', () => {
  it('tira protocolo, www e barra final', () => {
    expect(urlCurta('https://www.linkedin.com/in/fulano/')).toBe('linkedin.com/in/fulano')
  })
})

describe('agruparPorEmpresa', () => {
  it('junta cargos seguidos da mesma empresa com o período total', () => {
    const grupos = agruparPorEmpresa([
      { empresa: 'A', cargo: 'Sênior', periodo: 'set/2025 – atual' },
      { empresa: 'A', cargo: 'Júnior', periodo: 'jun/2019 – set/2025' },
      { empresa: 'B', cargo: 'Analista', periodo: 'nov/2018 – jun/2019' },
    ])

    expect(grupos.map((g) => [g.empresa, g.periodo, g.cargos.length])).toEqual([
      ['A', 'jun/2019 – atual', 2],
      ['B', 'nov/2018 – jun/2019', 1],
    ])
  })
})

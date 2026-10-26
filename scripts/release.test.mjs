import { describe, expect, it } from 'vitest'
import { lerCommit, montarNotas, proximaVersao } from './release.mjs'

const commit = (assunto, corpo = '') => lerCommit({ hash: 'abcdef1234567890', assunto, corpo })

describe('lerCommit', () => {
  it('separa tipo, escopo e descrição', () => {
    expect(commit('feat(contato): valida e-mail')).toMatchObject({
      tipo: 'feat',
      escopo: 'contato',
      quebra: false,
      descricao: 'valida e-mail',
    })
  })

  it('aceita commit sem prefixo', () => {
    expect(commit('Ajusta rodapé')).toMatchObject({ tipo: null, descricao: 'Ajusta rodapé' })
  })

  it('detecta quebra de compatibilidade pelo ! ou pelo corpo', () => {
    expect(commit('feat!: novo layout').quebra).toBe(true)
    expect(commit('refactor: troca rotas', 'BREAKING CHANGE: links antigos param de funcionar').quebra).toBe(true)
  })
})

describe('proximaVersao', () => {
  it('sobe patch para correções e commits sem prefixo', () => {
    expect(proximaVersao('v2.0.0', [commit('fix: corrige link'), commit('Ajusta rodapé')])).toBe('v2.0.1')
  })

  it('sobe minor quando há feat, zerando o patch', () => {
    expect(proximaVersao('v2.0.3', [commit('fix: corrige link'), commit('feat: nova seção')])).toBe('v2.1.0')
  })

  it('sobe major quando há quebra de compatibilidade', () => {
    expect(proximaVersao('v2.4.1', [commit('feat!: novo layout')])).toBe('v3.0.0')
  })
})

describe('montarNotas', () => {
  it('agrupa por seção e inclui links do commit e da comparação', () => {
    const notas = montarNotas({
      commits: [commit('feat(projetos): adiciona blog'), commit('fix: corrige link'), commit('Ajusta rodapé')],
      anterior: 'v2.0.0',
      versao: 'v2.1.0',
      repositorio: 'https://github.com/kmpc2013/portifolio',
      site: 'https://kmpc2013.github.io/portifolio/',
    })

    expect(notas).toContain('Versão publicada em https://kmpc2013.github.io/portifolio/')
    expect(notas).toContain(
      '### Novidades\n\n- Adiciona blog (projetos) ([abcdef1](https://github.com/kmpc2013/portifolio/commit/abcdef1234567890))',
    )
    expect(notas).toContain('### Correções\n\n- Corrige link')
    expect(notas).toContain('### Outras mudanças\n\n- Ajusta rodapé')
    expect(notas).toContain('https://github.com/kmpc2013/portifolio/compare/v2.0.0...v2.1.0')
    expect(notas).not.toContain('Desempenho')
  })
})

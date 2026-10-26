import { describe, expect, it } from 'vitest'
import { validar } from './validarContato'

// Ponto de partida válido: cada teste estraga só o campo que quer verificar
const valido = { nome: 'Ana', email: 'ana@empresa.com', mensagem: 'Quero conversar sobre uma vaga.' }

describe('validar', () => {
  it('não devolve erros quando todos os campos são válidos', () => {
    expect(validar(valido)).toEqual({})
  })

  it('aponta os três campos quando o formulário está vazio', () => {
    const erros = validar({ nome: '', email: '', mensagem: '' })
    expect(Object.keys(erros).sort()).toEqual(['email', 'mensagem', 'nome'])
  })

  it.each(['A', '   ', ' A '])('recusa nome curto ou só com espaços (%j)', (nome) => {
    expect(validar({ ...valido, nome })).toEqual({ nome: 'Informe seu nome.' })
  })

  it.each(['ana', 'ana@', 'ana@empresa', '@empresa.com', 'ana @empresa.com'])(
    'recusa e-mail inválido (%j)',
    (email) => {
      expect(validar({ ...valido, email })).toEqual({ email: 'Informe um e-mail válido.' })
    },
  )

  it.each(['a@b.co', 'luis.fernandes+portfolio@empresa.com.br'])('aceita e-mail válido (%j)', (email) => {
    expect(validar({ ...valido, email })).toEqual({})
  })

  it('exige pelo menos 10 caracteres na mensagem, sem contar espaços nas pontas', () => {
    expect(validar({ ...valido, mensagem: '   curta   ' })).toHaveProperty('mensagem')
    expect(validar({ ...valido, mensagem: '1234567890' })).toEqual({})
  })
})

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSecaoAtiva } from './useSecaoAtiva'

// O jsdom não calcula layout, então não tem IntersectionObserver de verdade.
// Este falso guarda o callback para o teste "dizer" qual seção cruzou o meio da tela.
let observador
class ObservadorFalso {
  constructor(callback) {
    this.callback = callback
    this.observados = []
    this.disconnect = vi.fn()
    observador = this
  }
  observe(elemento) {
    this.observados.push(elemento)
  }
  // Simula a seção entrando na faixa do meio da tela
  cruzar(id) {
    const alvo = this.observados.find((elemento) => elemento.id === id)
    this.callback([{ target: alvo, isIntersecting: true }])
  }
}

const ids = ['inicio', 'sobre', 'contato']

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', ObservadorFalso)
  document.body.innerHTML = ids.map((id) => `<section id="${id}"></section>`).join('')
})
afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useSecaoAtiva', () => {
  it('começa na primeira seção e observa todas as que existem na página', () => {
    const { result } = renderHook(() => useSecaoAtiva(ids))
    expect(result.current).toBe('inicio')
    expect(observador.observados.map((elemento) => elemento.id)).toEqual(ids)
  })

  it('troca para a seção que cruzou o meio da tela', () => {
    const { result } = renderHook(() => useSecaoAtiva(ids))

    act(() => observador.cruzar('sobre'))
    expect(result.current).toBe('sobre')

    act(() => observador.cruzar('contato'))
    expect(result.current).toBe('contato')
  })

  it('para de observar ao desmontar', () => {
    const { unmount } = renderHook(() => useSecaoAtiva(ids))
    unmount()
    expect(observador.disconnect).toHaveBeenCalledTimes(1)
  })
})

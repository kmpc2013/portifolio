import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import VisualizadorImagem from './VisualizadorImagem'

const props = (id) => ({ id, numero: '01', titulo: `Projeto ${id}`, imagem: `${id}.svg`, onFechar: vi.fn() })

describe('VisualizadorImagem', () => {
  // Cenário real: o visitante fecha uma imagem e abre outra antes da primeira terminar de sair.
  // Por um instante as duas ficam montadas; a rolagem não pode ser liberada (nem ficar presa) por engano.
  it('só libera a rolagem quando o último visualizador aberto é desmontado', () => {
    const a = render(<VisualizadorImagem {...props('a')} />)
    const b = render(<VisualizadorImagem {...props('b')} />)
    expect(document.documentElement.style.overflow).toBe('hidden')

    a.unmount() // a primeira termina de sair; a segunda continua aberta
    expect(document.documentElement.style.overflow).toBe('hidden')

    b.unmount()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('chama onFechar com Esc', () => {
    const p = props('c')
    render(<VisualizadorImagem {...p} />)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(p.onFechar).toHaveBeenCalledTimes(1)
  })
})

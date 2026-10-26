import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { projetos } from '../../data/projetos'
import Projetos from './Projetos'

// No jsdom nada é desenhado, então a animação de saída compartilhada (layoutId) nunca termina
// e o AnimatePresence não remove o diálogo. Aqui ele vira um "repasse": o que sai, some na hora.
// O resto do motion continua real.
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  AnimatePresence: ({ children }) => children,
}))

// Botão da miniatura do primeiro projeto ("Ampliar o diagrama do projeto ...")
const primeiro = projetos[0]
const botaoAmpliar = () => screen.getByRole('button', { name: `Ampliar o diagrama do projeto ${primeiro.titulo}` })

describe('Projetos: imagem ampliada', () => {
  it('abre o diálogo com a imagem e o título ao clicar na miniatura', async () => {
    const usuario = userEvent.setup()
    render(<Projetos />)

    await usuario.click(botaoAmpliar())

    const dialogo = screen.getByRole('dialog', { name: primeiro.titulo })
    expect(dialogo).toBeInTheDocument()
    // O foco vai para o botão de fechar e a página para de rolar
    expect(screen.getByRole('button', { name: /fechar/i })).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('fecha com Esc, devolve o foco à miniatura e libera a rolagem', async () => {
    const usuario = userEvent.setup()
    render(<Projetos />)

    await usuario.click(botaoAmpliar())
    await usuario.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(botaoAmpliar()).toHaveFocus()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('fecha pelo botão "Fechar"', async () => {
    const usuario = userEvent.setup()
    render(<Projetos />)

    await usuario.click(botaoAmpliar())
    await usuario.click(screen.getByRole('button', { name: /fechar/i }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

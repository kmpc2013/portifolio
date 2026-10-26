import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { projetos } from '../../data/projetos'
import Projetos from './Projetos'

// O jsdom não tem document.startViewTransition: os testes passam pelo caminho sem animação,
// o mesmo de quem usa "reduzir movimento" ou um navegador sem suporte.

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

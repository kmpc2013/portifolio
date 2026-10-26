import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { perfil } from '../../data/perfil'
import FormularioContato from './FormularioContato'

// O formulário "envia" trocando window.location.href por um mailto:.
// No jsdom isso tentaria navegar, então trocamos o location por um objeto simples e lemos o href.
const locationOriginal = window.location
beforeEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: { href: '' } })
})
afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: locationOriginal })
})

// Atalhos para os campos, buscados pelo rótulo (como um leitor de tela faria)
const campo = (rotulo) => screen.getByLabelText(rotulo)
const enviar = () => screen.getByRole('button', { name: /enviar mensagem/i })

describe('FormularioContato', () => {
  it('mostra os três erros e marca os campos como inválidos ao enviar vazio', async () => {
    const usuario = userEvent.setup()
    render(<FormularioContato />)

    await usuario.click(enviar())

    expect(screen.getByText('Informe seu nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(screen.getByText('A mensagem precisa ter pelo menos 10 caracteres.')).toBeInTheDocument()
    expect(campo(/nome/i)).toHaveAttribute('aria-invalid', 'true')
    expect(campo(/e-mail/i)).toHaveAttribute('aria-invalid', 'true')
    expect(campo(/mensagem/i)).toHaveAttribute('aria-invalid', 'true')
    // Nada foi "enviado"
    expect(window.location.href).toBe('')
  })

  it('tira o erro do campo depois de corrigido e reenviado', async () => {
    const usuario = userEvent.setup()
    render(<FormularioContato />)

    await usuario.click(enviar())
    await usuario.type(campo(/nome/i), 'Ana')
    await usuario.click(enviar())

    expect(screen.queryByText('Informe seu nome.')).not.toBeInTheDocument()
    expect(campo(/nome/i)).toHaveAttribute('aria-invalid', 'false')
    // Os outros campos continuam com erro
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
  })

  it('abre o mailto com assunto e corpo codificados, avisa o envio e limpa os campos', async () => {
    const usuario = userEvent.setup()
    render(<FormularioContato />)

    await usuario.type(campo(/nome/i), 'Ana Souza')
    await usuario.type(campo(/e-mail/i), 'ana@empresa.com')
    await usuario.type(campo(/mensagem/i), 'Olá! Vamos conversar?')
    await usuario.click(enviar())

    const assunto = encodeURIComponent('Contato pelo portfólio - Ana Souza')
    const corpo = encodeURIComponent('Olá! Vamos conversar?\n\nAna Souza (ana@empresa.com)')
    expect(window.location.href).toBe(`mailto:${perfil.email}?subject=${assunto}&body=${corpo}`)

    expect(screen.getByRole('status')).toHaveTextContent('Seu programa de e-mail foi aberto')
    expect(campo(/nome/i)).toHaveValue('')
    expect(campo(/e-mail/i)).toHaveValue('')
    expect(campo(/mensagem/i)).toHaveValue('')
  })
})

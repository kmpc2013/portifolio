import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { perfil } from '../../data/perfil'
import FormularioContato from './FormularioContato'

// O formulário envia com fetch para o Formspree. No teste, o fetch é falso:
// nenhuma requisição sai da máquina e dá para conferir com o que ele foi chamado.
let fetchFalso
beforeEach(() => {
  fetchFalso = vi.fn().mockResolvedValue({ ok: true, status: 200 })
  vi.stubGlobal('fetch', fetchFalso)
})
afterEach(() => {
  vi.unstubAllGlobals()
})

// Atalhos para os campos, buscados pelo rótulo (como um leitor de tela faria)
const campo = (rotulo) => screen.getByLabelText(rotulo)
const enviar = () => screen.getByRole('button', { name: /enviar mensagem/i })

async function preencher(usuario) {
  await usuario.type(campo(/nome/i), 'Ana Souza')
  await usuario.type(campo(/e-mail/i), 'ana@empresa.com')
  await usuario.type(campo(/mensagem/i), 'Olá! Vamos conversar?')
}

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
    // Nada foi enviado
    expect(fetchFalso).not.toHaveBeenCalled()
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
    expect(fetchFalso).not.toHaveBeenCalled()
  })

  it('envia os dados para o Formspree, avisa o envio e limpa os campos', async () => {
    const usuario = userEvent.setup()
    render(<FormularioContato />)

    await preencher(usuario)
    await usuario.click(enviar())

    expect(fetchFalso).toHaveBeenCalledTimes(1)
    const [url, opcoes] = fetchFalso.mock.calls[0]
    expect(url).toBe(perfil.formulario)
    expect(opcoes.method).toBe('POST')
    expect(JSON.parse(opcoes.body)).toEqual({
      nome: 'Ana Souza',
      email: 'ana@empresa.com',
      mensagem: 'Olá! Vamos conversar?',
      _subject: 'Contato pelo portfólio - Ana Souza',
      _gotcha: '',
    })

    expect(await screen.findByText('Mensagem enviada! Respondo em breve.')).toBeInTheDocument()
    expect(campo(/nome/i)).toHaveValue('')
    expect(campo(/e-mail/i)).toHaveValue('')
    expect(campo(/mensagem/i)).toHaveValue('')
  })

  it('em caso de falha, avisa, mantém o texto e oferece o e-mail direto', async () => {
    fetchFalso.mockRejectedValue(new TypeError('Failed to fetch'))
    const usuario = userEvent.setup()
    render(<FormularioContato />)

    await preencher(usuario)
    await usuario.click(enviar())

    expect(await screen.findByText(/não foi possível enviar/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: perfil.email })).toHaveAttribute('href', `mailto:${perfil.email}`)
    expect(campo(/nome/i)).toHaveValue('Ana Souza')
    expect(campo(/mensagem/i)).toHaveValue('Olá! Vamos conversar?')
  })

  it('trata resposta de erro do servidor (4xx/5xx) como falha', async () => {
    fetchFalso.mockResolvedValue({ ok: false, status: 422 })
    const usuario = userEvent.setup()
    render(<FormularioContato />)

    await preencher(usuario)
    await usuario.click(enviar())

    expect(await screen.findByText(/não foi possível enviar/i)).toBeInTheDocument()
    expect(campo(/e-mail/i)).toHaveValue('ana@empresa.com')
  })
})

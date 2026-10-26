import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LinhaProjeto from './LinhaProjeto'

// Projeto mínimo: cada teste acrescenta só os campos opcionais que quer verificar
const base = {
  numero: '01',
  titulo: 'Projeto de teste',
  descricao: 'Descrição do projeto.',
  imagem: 'imagem.svg',
  tecnologias: ['Docker', 'Zabbix'],
  repositorio: null,
  demo: null,
}

describe('LinhaProjeto', () => {
  it('mostra título, descrição e tecnologias', () => {
    render(<LinhaProjeto {...base} />)
    expect(screen.getByRole('heading', { name: 'Projeto de teste' })).toBeInTheDocument()
    expect(screen.getByText('Descrição do projeto.')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Docker', 'Zabbix'])
  })

  it('mostra o impacto só quando o projeto tem um', () => {
    const { rerender } = render(<LinhaProjeto {...base} />)
    expect(screen.queryByText(/chamados duplicados/)).not.toBeInTheDocument()

    rerender(<LinhaProjeto {...base} impacto="−70% de chamados duplicados" />)
    expect(screen.getByText('−70% de chamados duplicados')).toBeInTheDocument()
  })

  it('troca o link por um aviso quando o repositório é privado', () => {
    render(<LinhaProjeto {...base} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/repositório privado/i)).toBeInTheDocument()
  })

  it('mostra os links de repositório e demo quando existem', () => {
    render(<LinhaProjeto {...base} repositorio="https://github.com/x/y" demo="https://x.github.io/y" status="Em andamento" />)
    expect(screen.getByRole('link', { name: /repositório/i })).toHaveAttribute('href', 'https://github.com/x/y')
    expect(screen.getByRole('link', { name: /ver online/i })).toHaveAttribute('href', 'https://x.github.io/y')
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })
})

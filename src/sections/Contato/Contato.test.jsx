import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { perfil } from '../../data/perfil'
import Contato from './Contato'

describe('Contato', () => {
  it('oferece o currículo para baixar, sem abrir nova aba', () => {
    render(<Contato />)

    const link = screen.getByRole('link', { name: /currículo \(pdf\)/i })
    expect(link.getAttribute('href')).toMatch(new RegExp(`${perfil.curriculo}$`))
    expect(link).toHaveAttribute('download')
    expect(link).not.toHaveAttribute('target')
  })

  it('mostra a disponibilidade', () => {
    render(<Contato />)

    expect(screen.getByText(perfil.disponibilidade.join(' · '), { exact: false })).toBeInTheDocument()
  })
})

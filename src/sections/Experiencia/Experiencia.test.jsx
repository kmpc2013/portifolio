import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { experiencia } from '../../data/experiencia'
import Experiencia from './Experiencia'

describe('Experiencia', () => {
  it('mostra um item por cargo, na ordem dos dados', () => {
    render(<Experiencia />)

    const cargos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(cargos).toEqual(experiencia.map((item) => item.cargo))
  })

  it('mostra empresa, período e conquistas de cada cargo', () => {
    render(<Experiencia />)

    experiencia.forEach((item) => {
      const linha = screen.getByRole('heading', { name: item.cargo }).closest('li')
      expect(within(linha).getByText(item.empresa)).toBeInTheDocument()
      expect(within(linha).getByText(item.periodo)).toBeInTheDocument()
      item.conquistas.forEach((conquista) => expect(within(linha).getByText(conquista)).toBeInTheDocument())
    })
  })
})

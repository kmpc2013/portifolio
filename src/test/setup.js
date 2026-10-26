// Roda antes de cada arquivo de teste.
// jest-dom adiciona matchers legíveis, como toBeInTheDocument() e toHaveAttribute().
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta o que cada teste renderizou, para um teste não enxergar a tela do outro
afterEach(() => cleanup())

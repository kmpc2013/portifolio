import { Suspense } from 'react'

// Mostra a versão estática (leve, sem JS de animação) até "ativo" virar true.
// Depois troca pela versão animada, que normalmente é um componente lazy: enquanto o arquivo
// dele baixa, o Suspense continua mostrando a estática, então a tela não pisca nem fica vazia.
export default function Animado({ ativo, estatico, children }) {
  if (!ativo) return estatico
  return <Suspense fallback={estatico}>{children}</Suspense>
}

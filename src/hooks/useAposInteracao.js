import { useEffect, useState } from 'react'

// Eventos que indicam que o visitante começou a usar a página
const eventos = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown']

// Hook personalizado: devolve false até a primeira interação e true a partir dela.
// Serve para adiar algo pesado (como o fundo em WebGL do hero) sem atrasar a primeira tela.
export function useAposInteracao() {
  const [interagiu, setInteragiu] = useState(false)

  useEffect(() => {
    if (interagiu) return undefined

    const ativar = () => setInteragiu(true)
    // passive: true avisa o navegador que não vamos bloquear o scroll
    eventos.forEach((evento) => window.addEventListener(evento, ativar, { once: true, passive: true }))

    // Limpeza: remove os ouvintes que sobraram (os outros eventos que não dispararam)
    return () => eventos.forEach((evento) => window.removeEventListener(evento, ativar))
  }, [interagiu])

  return interagiu
}

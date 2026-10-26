import { useEffect, useState } from 'react'

// Hook personalizado: devolve o id da seção que está no meio da tela.
// O cabeçalho usa esse valor para destacar o link correspondente no menu.
export function useSecaoAtiva(ids) {
  const [ativa, setAtiva] = useState(ids[0])

  useEffect(() => {
    // O IntersectionObserver avisa quando um elemento entra/sai de uma área da tela,
    // sem precisar escutar o evento de scroll a cada pixel.
    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setAtiva(entrada.target.id)
        })
      },
      // Reduz a área observada a uma faixa fina no meio da tela:
      // só uma seção por vez cruza essa faixa.
      { rootMargin: '-50% 0px -50% 0px' },
    )

    ids.forEach((id) => {
      const elemento = document.getElementById(id)
      if (elemento) observer.observe(elemento)
    })

    // Limpeza: ao desmontar o componente, para de observar (evita vazamento de memória)
    return () => observer.disconnect()
  }, [ids])

  return ativa
}

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './VisualizadorImagem.module.css'

// Quantos visualizadores estão montados agora. A rolagem só é liberada no zero, então
// abrir e fechar em sequência rápida nunca deixa a página presa nem solta por engano.
let abertos = 0
function travarRolagem(travar) {
  abertos += travar ? 1 : -1
  document.documentElement.style.overflow = abertos > 0 ? 'hidden' : ''
}

// Imagem ampliada por cima da página (lightbox).
// A imagem sai do lugar da miniatura e cresce até o centro graças ao view-transition-name,
// que precisa ser igual ao da miniatura em LinhaProjeto (a transição é disparada em Projetos).
export default function VisualizadorImagem({ id, numero, titulo, impacto, imagem, onFechar }) {
  const camadaRef = useRef(null)
  const botaoFecharRef = useRef(null)

  useEffect(() => {
    // Guarda quem tinha o foco (o botão da miniatura) para devolver ao fechar
    const focoAnterior = document.activeElement
    botaoFecharRef.current?.focus()

    // Trava a rolagem da página enquanto a imagem está aberta
    travarRolagem(true)

    // Esc fecha; Tab fica preso no botão de fechar (é o único controle do diálogo)
    function aoTeclar(evento) {
      if (evento.key === 'Escape') onFechar()
      if (evento.key === 'Tab') {
        evento.preventDefault()
        botaoFecharRef.current?.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)

    // Limpeza: libera a rolagem, remove o ouvinte e devolve o foco à miniatura.
    // O foco só volta se ainda estiver neste diálogo (ou solto no body): se outra imagem
    // já foi aberta, ela fica com o foco.
    const camada = camadaRef.current
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      travarRolagem(false)
      const ativo = document.activeElement
      if (ativo === document.body || camada?.contains(ativo)) {
        focoAnterior?.focus?.({ preventScroll: true })
      }
    }
  }, [onFechar])

  // createPortal desenha o diálogo direto no <body>, fora da lista de projetos,
  // para ele ficar por cima de tudo sem ser cortado pelo overflow das seções
  // O clique na camada é só um atalho do mouse: pelo teclado, Esc e o botão "Fechar" fazem o mesmo.
  // role="dialog" em vez de <dialog>: o <dialog> nativo abre na top layer e quebraria a animação da imagem.
  return createPortal(
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={camadaRef}
      className={styles.camada}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="dialog"
      aria-modal="true"
      aria-labelledby={`ampliado-${id}-titulo`}
      // Clicar em qualquer lugar fora do botão de fechar também fecha
      onClick={onFechar}
    >
      {/* Fundo escuro e desfocado: entra e sai com o fade da própria View Transition */}
      <div className={styles.fundo} />

      <figure className={styles.conteudo}>
        <div className={styles.moldura} style={{ viewTransitionName: `imagem-${id}` }}>
          <img src={imagem} alt={`Diagrama do projeto ${titulo}`} className={styles.imagem} />
        </div>

        <figcaption className={styles.legenda}>
          <span className={styles.numero} aria-hidden="true">
            {numero} /
          </span>
          <span id={`ampliado-${id}-titulo`} className={styles.titulo}>
            {titulo}
          </span>
          {impacto && <span className={styles.impacto}>▲ {impacto}</span>}
        </figcaption>
      </figure>

      <button ref={botaoFecharRef} type="button" className={`${styles.fechar} cursor-target`} onClick={onFechar}>
        Fechar <kbd aria-hidden="true">Esc</kbd>
      </button>
    </div>,
    document.body,
  )
}

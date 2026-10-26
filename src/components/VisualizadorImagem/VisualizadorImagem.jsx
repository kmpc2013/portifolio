import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import styles from './VisualizadorImagem.module.css'

// Mola usada na ampliação: rápida, com um leve "assentamento" no final
const mola = { type: 'spring', stiffness: 260, damping: 30 }

// Quantos visualizadores estão montados agora. Pode haver dois ao mesmo tempo por um instante:
// um terminando a animação de saída e outro acabando de abrir. A rolagem só é liberada no zero.
let abertos = 0
function travarRolagem(travar) {
  abertos += travar ? 1 : -1
  document.documentElement.style.overflow = abertos > 0 ? 'hidden' : ''
}

// Imagem ampliada por cima da página (lightbox).
// A imagem sai do lugar da miniatura e cresce até o centro graças ao layoutId,
// que precisa ser igual ao da miniatura em LinhaProjeto.
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
  return createPortal(
    <div
      ref={camadaRef}
      className={styles.camada}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`ampliado-${id}-titulo`}
      // Clicar em qualquer lugar fora do botão de fechar também fecha
      onClick={onFechar}
    >
      {/* Fundo escuro e desfocado: entra e sai com fade */}
      <motion.div
        className={styles.fundo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      <figure className={styles.conteudo}>
        <motion.div layoutId={`imagem-${id}`} className={styles.moldura} transition={mola}>
          <img src={imagem} alt={`Diagrama do projeto ${titulo}`} className={styles.imagem} />
        </motion.div>

        {/* Legenda sobe um pouco depois da imagem chegar */}
        <motion.figcaption
          className={styles.legenda}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.3 } }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
        >
          <span className={styles.numero} aria-hidden="true">
            {numero} /
          </span>
          <span id={`ampliado-${id}-titulo`} className={styles.titulo}>
            {titulo}
          </span>
          {impacto && <span className={styles.impacto}>▲ {impacto}</span>}
        </motion.figcaption>
      </figure>

      <motion.button
        ref={botaoFecharRef}
        type="button"
        className={`${styles.fechar} cursor-target`}
        onClick={onFechar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        Fechar <kbd aria-hidden="true">Esc</kbd>
      </motion.button>
    </div>,
    document.body,
  )
}

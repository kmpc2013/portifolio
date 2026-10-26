import { useCallback, useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig } from 'motion/react'
import Secao from '../../components/Secao/Secao'
import LinhaProjeto from '../../components/LinhaProjeto/LinhaProjeto'
import VisualizadorImagem from '../../components/VisualizadorImagem/VisualizadorImagem'
import { projetos } from '../../data/projetos'
import styles from './Projetos.module.css'

// Número com dois dígitos a partir da posição no array: 0 -> "01"
const numerar = (indice) => String(indice + 1).padStart(2, '0')

export default function Projetos() {
  // id do projeto com a imagem ampliada (null = nenhuma aberta)
  const [ampliado, setAmpliado] = useState(null)
  // useCallback: a mesma função em todo render, para o useEffect do visualizador
  // não rodar de novo (e devolver o foco) a cada renderização
  const fechar = useCallback(() => setAmpliado(null), [])

  const indiceAmpliado = projetos.findIndex((projeto) => projeto.id === ampliado)

  return (
    <Secao id="projetos" indice="03" titulo="Projetos">
      {/* MotionConfig "user": quem pediu menos movimento no sistema vê a imagem abrir sem animação.
          LayoutGroup: liga a miniatura e a imagem ampliada que têm o mesmo layoutId. */}
      <MotionConfig reducedMotion="user">
        <LayoutGroup>
          <div className={styles.lista}>
            {/* {...projeto} espalha cada campo do objeto como uma prop da linha */}
            {projetos.map((projeto, indice) => (
              <LinhaProjeto key={projeto.id} numero={numerar(indice)} {...projeto} onAmpliar={setAmpliado} />
            ))}
          </div>

          {/* AnimatePresence deixa o visualizador terminar a animação de saída antes de sumir */}
          <AnimatePresence>
            {ampliado && (
              <VisualizadorImagem
                key={ampliado}
                {...projetos[indiceAmpliado]}
                numero={numerar(indiceAmpliado)}
                onFechar={fechar}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </MotionConfig>
    </Secao>
  )
}

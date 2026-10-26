import { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'
import Secao from '../../components/Secao/Secao'
import LinhaProjeto from '../../components/LinhaProjeto/LinhaProjeto'
import VisualizadorImagem from '../../components/VisualizadorImagem/VisualizadorImagem'
import { projetos } from '../../data/projetos'
import styles from './Projetos.module.css'

// Número com dois dígitos a partir da posição no array: 0 -> "01"
const numerar = (indice) => String(indice + 1).padStart(2, '0')

// View Transitions API (nativa do navegador, sem biblioteca): o navegador fotografa a tela antes
// e depois da troca de estado e anima a imagem que tem o mesmo view-transition-name nas duas
// fotos, da miniatura até a versão ampliada. flushSync garante que o React aplique a troca
// dentro da transição. Sem suporte, ou com "reduzir movimento" ligado, a troca é direta.
function comTransicao(atualizar) {
  const semAnimacao = !document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (semAnimacao) atualizar()
  else document.startViewTransition(() => flushSync(atualizar))
}

export default function Projetos() {
  // id do projeto com a imagem ampliada (null = nenhuma aberta)
  const [ampliado, setAmpliado] = useState(null)
  const abrir = useCallback((id) => comTransicao(() => setAmpliado(id)), [])
  // useCallback: a mesma função em todo render, para o useEffect do visualizador
  // não rodar de novo (e devolver o foco) a cada renderização
  const fechar = useCallback(() => comTransicao(() => setAmpliado(null)), [])

  const indiceAmpliado = projetos.findIndex((projeto) => projeto.id === ampliado)

  return (
    <Secao id="projetos" indice="03" titulo="Projetos">
      <div className={styles.lista}>
        {/* {...projeto} espalha cada campo do objeto como uma prop da linha */}
        {projetos.map((projeto, indice) => (
          <LinhaProjeto
            key={projeto.id}
            numero={numerar(indice)}
            {...projeto}
            ampliado={projeto.id === ampliado}
            onAmpliar={abrir}
          />
        ))}
      </div>

      {ampliado && (
        <VisualizadorImagem
          key={ampliado}
          {...projetos[indiceAmpliado]}
          numero={numerar(indiceAmpliado)}
          onFechar={fechar}
        />
      )}
    </Secao>
  )
}

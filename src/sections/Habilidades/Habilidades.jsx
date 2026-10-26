import { lazy, Suspense } from 'react'
import Secao from '../../components/Secao/Secao'
import Etiqueta from '../../components/Etiqueta/Etiqueta'
import { habilidades } from '../../data/habilidades'
import styles from './Habilidades.module.css'

// lazy: o letreiro fica bem abaixo da primeira tela, então não precisa atrasar o carregamento inicial
const ScrollVelocity = lazy(() => import('../../components/reactbits/ScrollVelocity/ScrollVelocity'))

// Duas faixas para o letreiro: metade dos grupos em cada uma, itens separados por ✦
const metade = Math.ceil(habilidades.length / 2)
const juntar = (grupos) => grupos.flatMap((grupo) => grupo.itens).join('  ✦  ')
const faixas = [juntar(habilidades.slice(0, metade)), juntar(habilidades.slice(metade))]

export default function Habilidades() {
  return (
    <Secao id="habilidades" indice="04" titulo="Habilidades">
      {/* Letreiro gigante (ScrollVelocity, React Bits): acelera conforme a velocidade do scroll.
          É só decoração; a lista real e acessível vem logo abaixo. */}
      <div className={styles.letreiro} aria-hidden="true">
        <Suspense fallback={null}>
          <ScrollVelocity
            texts={faixas}
            velocity={40}
            numCopies={4}
            className={styles.faixa}
            outlineAlternate
            skewWithVelocity={8}
            fadeEdges
          />
        </Suspense>
      </div>

      <div className={styles.grade}>
        {/* map dentro de map: primeiro os grupos, depois os itens de cada grupo */}
        {habilidades.map((grupo, indice) => (
          <div key={grupo.categoria} className={styles.grupo}>
            <h3 className={styles.categoria}>
              <span aria-hidden="true">{String(indice + 1).padStart(2, '0')} </span>
              {grupo.categoria}
            </h3>
            <ul className={styles.lista}>
              {grupo.itens.map((item) => (
                <Etiqueta key={item}>{item}</Etiqueta>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Secao>
  )
}

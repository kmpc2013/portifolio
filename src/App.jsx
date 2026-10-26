import { lazy, Suspense } from 'react'
import Cabecalho from './components/Cabecalho/Cabecalho'
import Rodape from './components/Rodape/Rodape'
import Inicio from './sections/Inicio/Inicio'
import Sobre from './sections/Sobre/Sobre'
import Experiencia from './sections/Experiencia/Experiencia'
import Projetos from './sections/Projetos/Projetos'
import Habilidades from './sections/Habilidades/Habilidades'
import Formacao from './sections/Formacao/Formacao'
import Contato from './sections/Contato/Contato'

// lazy: o cursor-mira vira um arquivo separado, baixado só por quem usa mouse
const TargetCursor = lazy(() => import('./components/reactbits/TargetCursor/TargetCursor'))

// Avaliado uma vez ao carregar: no celular (toque) o cursor nem é baixado
const temMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches

// App só organiza a página: a ordem das seções aqui é a ordem na tela.
export default function App() {
  return (
    <>
      {/* Cursor-mira (React Bits): trava nos elementos com a classe "cursor-target".
          Ele mesmo se desliga com "reduzir movimento" ativo. */}
      {temMouse && (
        <Suspense fallback={null}>
          <TargetCursor targetSelector=".cursor-target" cursorColor="#c6ff3d" spinDuration={3} blendMode="normal" />
        </Suspense>
      )}
      <Cabecalho />
      <main>
        <Inicio />
        <Sobre />
        <Experiencia />
        <Projetos />
        <Habilidades />
        <Formacao />
        <Contato />
      </main>
      <Rodape />
    </>
  )
}

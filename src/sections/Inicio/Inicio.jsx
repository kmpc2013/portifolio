import { lazy, Suspense } from 'react'
import { perfil } from '../../data/perfil'
import { useAposInteracao } from '../../hooks/useAposInteracao'
import Animado from '../../components/Animado/Animado'
import poster from '../../assets/hero-poster.webp'
import styles from './Inicio.module.css'

// lazy: cada efeito vira um arquivo separado. Nenhum deles entra no JS da primeira tela,
// que assim fica menor e mostra o texto mais cedo (o resumo é o LCP no celular).
const FaultyTerminal = lazy(() => import('../../components/reactbits/FaultyTerminal/FaultyTerminal'))
const Shuffle = lazy(() => import('../../components/reactbits/Shuffle/Shuffle'))
const DecryptedText = lazy(() => import('../../components/reactbits/DecryptedText/DecryptedText'))
const Magnet = lazy(() => import('../../components/reactbits/Magnet/Magnet'))

// O nome é quebrado em palavras: cada uma vira uma linha gigante animada no h1
const partesDoNome = perfil.nome.split(' ')

// BASE_URL: no GitHub Pages o site fica em /<repositório>/, e o PDF vem de public/
const linkCurriculo = `${import.meta.env.BASE_URL}${perfil.curriculo}`

// Página inicial (hero): primeira coisa que o recrutador vê. Nome, cargo, resumo e chamadas.
export default function Inicio() {
  // A primeira tela abre só com texto e uma imagem leve da grade. Os efeitos (terminal em WebGL,
  // letras embaralhando, botões magnéticos) só são baixados e montados quando o visitante interage.
  const interagiu = useAposInteracao()

  // Botão com efeito magnético (React Bits) depois da interação; antes, o link puro
  const comIma = (link) => (
    <Animado ativo={interagiu} estatico={link}>
      <Magnet padding={60} magnetStrength={3}>
        {link}
      </Magnet>
    </Animado>
  )

  return (
    <section id="inicio" className={styles.inicio}>
      {/* Fundo: imagem estática + terminal em WebGL com glitch (React Bits). Puramente decorativo. */}
      <div
        className={`${styles.fundo} ${interagiu ? styles.ativo : ''}`}
        style={{ '--poster': `url(${poster})` }}
        aria-hidden="true"
      >
        {interagiu && (
          <Suspense fallback={null}>
            <FaultyTerminal
              tint="#c6ff3d"
              glyphs="blocks"
              scale={1.5}
              digitSize={1.2}
              timeScale={0.5}
              brightness={0.6}
              dpr={1.5}
              glow={0.5}
              persistence={0.5}
              mouseStrength={0.5}
              mouseGlow={0.6}
              curvature={0.1}
              vignette={0.25}
              clickEffect="glitch"
            />
          </Suspense>
        )}
      </div>
      {/* Camada de degradê por cima do terminal: garante contraste para o texto */}
      <div className={styles.veu} aria-hidden="true" />

      <div className={styles.conteudo}>
        <p className={styles.prompt}>
          <span aria-hidden="true">&gt; </span>
          <Animado ativo={interagiu} estatico="whoami">
            <DecryptedText text="whoami" animateOn="view" sequential speed={70} />
          </Animado>
        </p>

        {/* Único h1 da página: o nome é o assunto principal do site.
            Cada palavra embaralha as letras ao aparecer e de novo ao passar o mouse.
            O leitor de tela lê o nome inteiro do span .sr-only; as letras animadas ficam escondidas dele. */}
        <h1 className={styles.nome}>
          <span className="sr-only">{perfil.nome}</span>
          <span className={styles.nomeVisual} aria-hidden="true">
            {partesDoNome.map((parte) => (
              <Animado key={parte} ativo={interagiu} estatico={<span className={styles.linhaNome}>{parte}</span>}>
                <Shuffle
                  text={parte}
                  tag="span"
                  className={styles.linhaNome}
                  textAlign="left"
                  shuffleDirection="right"
                  duration={0.4}
                  stagger={0.04}
                  shuffleTimes={2}
                  scrambleCharset="01#$%&<>/"
                  triggerOnHover
                />
              </Animado>
            ))}
          </span>
        </h1>

        <p className={styles.cargo}>
          <Animado ativo={interagiu} estatico={perfil.cargo}>
            <DecryptedText
              text={perfil.cargo}
              animateOn="view"
              revealDirection="start"
              sequential
              speed={35}
              encryptedClassName={styles.cifrado}
            />
          </Animado>
        </p>
        <p className={styles.resumo}>{perfil.resumo}</p>
        <p className={styles.disponibilidade}>
          <span className={styles.rotulo}>Aberto a:</span> {perfil.disponibilidade.join(' · ')}
        </p>

        <div className={styles.acoes}>
          {comIma(
            <a href="#projetos" className={`${styles.botaoPrimario} cursor-target`}>
              Ver projetos <span aria-hidden="true">→</span>
            </a>,
          )}
          {comIma(
            <a href="#contato" className={`${styles.botaoSecundario} cursor-target`}>
              Fale comigo
            </a>,
          )}
          {comIma(
            <a href={linkCurriculo} download className={`${styles.botaoSecundario} cursor-target`}>
              Baixar currículo (PDF)
            </a>,
          )}
        </div>
      </div>

      {/* Barra de status no pé do hero, como um painel de monitoramento */}
      <div className={styles.status} aria-hidden="true">
        <span>{perfil.localizacao}</span>
        <span>
          <span className={styles.ponto} /> status: online
        </span>
        <span className={styles.rolar}>scroll ↓</span>
      </div>
    </section>
  )
}

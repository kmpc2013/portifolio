import { lazy, Suspense } from 'react'
import { perfil } from '../../data/perfil'
import { useAposInteracao } from '../../hooks/useAposInteracao'
import Shuffle from '../../components/reactbits/Shuffle/Shuffle'
import DecryptedText from '../../components/reactbits/DecryptedText/DecryptedText'
import Magnet from '../../components/reactbits/Magnet/Magnet'
import poster from '../../assets/hero-poster.webp'
import styles from './Inicio.module.css'

// lazy: o código do terminal em WebGL vira um arquivo separado, baixado só quando for usado
const FaultyTerminal = lazy(() => import('../../components/reactbits/FaultyTerminal/FaultyTerminal'))

// O nome é quebrado em palavras: cada uma vira uma linha gigante animada no h1
const partesDoNome = perfil.nome.split(' ')

// BASE_URL: no GitHub Pages o site fica em /<repositório>/, e o PDF vem de public/
const linkCurriculo = `${import.meta.env.BASE_URL}${perfil.curriculo}`

// Página inicial (hero): primeira coisa que o recrutador vê. Nome, cargo, resumo e chamadas.
export default function Inicio() {
  // O WebGL é pesado para montar (principalmente em celular). A primeira tela abre com uma
  // imagem leve da mesma grade e o terminal animado só entra quando o visitante interage.
  const terminalAtivo = useAposInteracao()

  return (
    <section id="inicio" className={styles.inicio}>
      {/* Fundo: imagem estática + terminal em WebGL com glitch (React Bits). Puramente decorativo. */}
      <div
        className={`${styles.fundo} ${terminalAtivo ? styles.ativo : ''}`}
        style={{ '--poster': `url(${poster})` }}
        aria-hidden="true"
      >
        {terminalAtivo && (
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
          <DecryptedText text="whoami" animateOn="view" sequential speed={70} />
        </p>

        {/* Único h1 da página: o nome é o assunto principal do site.
            Cada palavra embaralha as letras ao aparecer e de novo ao passar o mouse.
            O leitor de tela lê o nome inteiro do span .sr-only; as letras animadas ficam escondidas dele. */}
        <h1 className={styles.nome}>
          <span className="sr-only">{perfil.nome}</span>
          <span className={styles.nomeVisual} aria-hidden="true">
            {partesDoNome.map((parte) => (
              <Shuffle
                key={parte}
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
            ))}
          </span>
        </h1>

        <p className={styles.cargo}>
          <DecryptedText
            text={perfil.cargo}
            animateOn="view"
            revealDirection="start"
            sequential
            speed={35}
            encryptedClassName={styles.cifrado}
          />
        </p>
        <p className={styles.resumo}>{perfil.resumo}</p>
        <p className={styles.disponibilidade}>
          <span className={styles.rotulo}>Aberto a:</span> {perfil.disponibilidade.join(' · ')}
        </p>

        <div className={styles.acoes}>
          {/* Magnet (React Bits): o botão é "puxado" levemente na direção do mouse */}
          <Magnet padding={60} magnetStrength={3}>
            <a href="#projetos" className={`${styles.botaoPrimario} cursor-target`}>
              Ver projetos <span aria-hidden="true">→</span>
            </a>
          </Magnet>
          <Magnet padding={60} magnetStrength={3}>
            <a href="#contato" className={`${styles.botaoSecundario} cursor-target`}>
              Fale comigo
            </a>
          </Magnet>
          <Magnet padding={60} magnetStrength={3}>
            <a href={linkCurriculo} download className={`${styles.botaoSecundario} cursor-target`}>
              Baixar currículo (PDF)
            </a>
          </Magnet>
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

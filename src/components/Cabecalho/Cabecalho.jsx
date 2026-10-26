import { useState } from 'react'
import { perfil, secoes } from '../../data/perfil'
import { useSecaoAtiva } from '../../hooks/useSecaoAtiva'
import styles from './Cabecalho.module.css'

// Lista de ids fora do componente: é a mesma referência em todo render,
// então o useEffect do hook não roda de novo à toa.
const ids = secoes.map((secao) => secao.id)

// "Luis Fernandes" -> "LF": iniciais para o logo estilo prompt
const iniciais = perfil.nome
  .split(' ')
  .map((parte) => parte[0])
  .join('')

export default function Cabecalho() {
  // Controla o menu no celular (aberto/fechado)
  const [menuAberto, setMenuAberto] = useState(false)
  const secaoAtiva = useSecaoAtiva(ids)

  return (
    <header className={`${styles.cabecalho} ${menuAberto ? styles.comMenu : ''}`}>
      <div className={styles.conteudo}>
        <a href="#inicio" className={`${styles.logo} cursor-target`} aria-label={`${iniciais}: ${perfil.nome}, voltar ao início`}>
          {iniciais}
          <span className={styles.cursorPiscando} aria-hidden="true">
            _
          </span>
        </a>

        {/* Botão do menu: só aparece no celular (ver CSS) */}
        <button
          type="button"
          className={styles.botaoMenu}
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          {menuAberto ? 'Fechar' : 'Menu'}
        </button>

        {/* A classe "aberto" é somada só quando o menu está aberto */}
        <nav
          id="menu-principal"
          aria-label="Seções do portfólio"
          className={`${styles.menu} ${menuAberto ? styles.aberto : ''}`}
        >
          {secoes.map((secao, indice) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className={`${secaoAtiva === secao.id ? styles.ativo : ''} cursor-target`}
              // aria-current avisa leitores de tela qual é a seção atual
              aria-current={secaoAtiva === secao.id ? 'true' : undefined}
              // Ao escolher uma seção no celular, o menu fecha sozinho
              onClick={() => setMenuAberto(false)}
            >
              {/* Número com dois dígitos: 00, 01, 02... */}
              <span className={styles.numero} aria-hidden="true">
                {String(indice).padStart(2, '0')}
              </span>
              {secao.rotulo}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

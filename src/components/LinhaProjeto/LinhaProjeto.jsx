import Etiqueta from '../Etiqueta/Etiqueta'
import styles from './LinhaProjeto.module.css'

// Recebe um projeto por props e monta uma linha da lista. Não sabe de onde os dados vêm:
// quem decide a lista é a seção Projetos (que também manda o "numero" da linha
// e a função onAmpliar, chamada ao clicar na imagem).
export default function LinhaProjeto({
  id,
  numero,
  titulo,
  descricao,
  impacto,
  imagem,
  tecnologias,
  repositorio,
  demo,
  relatorio,
  status,
  ampliado = false,
  onAmpliar,
}) {
  return (
    <article className={styles.linha}>
      <span className={styles.numero} aria-hidden="true">
        {numero}
      </span>

      <div className={styles.corpo}>
        {/* Status opcional (ex.: "Em andamento"), só aparece se o projeto tiver */}
        {status && (
          <p className={styles.status}>
            <span className={styles.ponto} aria-hidden="true" /> {status}
          </p>
        )}
        <h3 className={styles.titulo}>{titulo}</h3>
        {/* Resultado em número (opcional): a primeira coisa que o recrutador lê depois do título */}
        {impacto && (
          <p className={styles.impacto}>
            <span aria-hidden="true">▲ </span>
            {impacto}
          </p>
        )}
        <p className={styles.descricao}>{descricao}</p>

        <ul className={styles.tecnologias} aria-label="Tecnologias usadas">
          {tecnologias.map((tecnologia) => (
            <Etiqueta key={tecnologia}>{tecnologia}</Etiqueta>
          ))}
        </ul>

        <div className={styles.links}>
          {/* Projeto interno não tem link público: mostra só um aviso no lugar do botão.
              target="_blank" abre em outra aba; rel="noreferrer" impede a outra página de controlar esta */}
          {repositorio ? (
            <a href={repositorio} target="_blank" rel="noreferrer" className={`${styles.link} cursor-target`}>
              Repositório <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className={styles.privado}>Repositório privado · projeto interno</span>
          )}
          {/* Renderização condicional: só mostra o link se existir demo */}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className={`${styles.link} ${styles.linkDemo} cursor-target`}
            >
              Ver online <span aria-hidden="true">↗</span>
            </a>
          )}
          {/* Evidência do resultado (opcional): relatório em PDF servido pelo próprio site */}
          {relatorio && (
            <a href={relatorio} target="_blank" rel="noreferrer" className={`${styles.link} cursor-target`}>
              Relatório (PDF) <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* No desktop a imagem fica recortada e se revela ao passar o mouse na linha (ver CSS).
          É um <button>: dá para ampliar com clique, toque ou teclado (Enter/Espaço).
          O aria-label começa com "Ampliar", o mesmo texto do selo visível. */}
      <button
        type="button"
        className={`${styles.moldura} cursor-target`}
        onClick={() => onAmpliar(id)}
        aria-label={`Ampliar o diagrama do projeto ${titulo}`}
        data-cursor-label="ampliar"
      >
        {/* view-transition-name liga esta imagem à versão ampliada: o navegador anima uma até a outra.
            Enquanto ela está ampliada, o nome fica só no visualizador (o nome precisa ser único na tela). */}
        <span className={styles.camadaImagem} style={{ viewTransitionName: ampliado ? 'none' : `imagem-${id}` }}>
          <img src={imagem} alt={`Diagrama do projeto ${titulo}`} className={styles.imagem} loading="lazy" />
        </span>
        <span className={styles.selo} aria-hidden="true">
          Ampliar ⤢
        </span>
      </button>
    </article>
  )
}

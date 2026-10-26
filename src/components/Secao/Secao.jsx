import styles from './Secao.module.css'

// Moldura comum a todas as seções: id para a âncora do menu, índice, título e largura máxima.
// "children" é o conteúdo que cada seção coloca dentro da moldura.
export default function Secao({ id, indice, titulo, children }) {
  return (
    <section id={id} className={styles.secao} aria-labelledby={`${id}-titulo`}>
      <div className={styles.topo}>
        {/* Índice estilo terminal ("01 /"): decorativo, por isso aria-hidden */}
        <span className={styles.indice} aria-hidden="true">
          {indice} /
        </span>
        <h2 id={`${id}-titulo`} className={styles.titulo}>
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  )
}

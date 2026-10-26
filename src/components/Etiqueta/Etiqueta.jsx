import styles from './Etiqueta.module.css'

// Etiqueta reutilizada nas tecnologias dos projetos e na lista de habilidades.
export default function Etiqueta({ children }) {
  return <li className={styles.etiqueta}>{children}</li>
}

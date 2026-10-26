import Secao from '../../components/Secao/Secao'
import { formacao, certificacoes } from '../../data/formacao'
import styles from './Formacao.module.css'

// Formação acadêmica e certificações em duas listas no estilo "log": data | título | instituição
export default function Formacao() {
  return (
    <Secao id="formacao" indice="05" titulo="Formação">
      <div className={styles.grade}>
        <div>
          <h3 className={styles.subtitulo}>Acadêmica</h3>
          <ul className={styles.lista}>
            {formacao.map((item) => (
              <li key={item.titulo} className={styles.item}>
                <span className={styles.data}>{item.periodo}</span>
                <span className={styles.titulo}>{item.titulo}</span>
                <span className={styles.origem}>{item.instituicao}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={styles.subtitulo}>Certificações</h3>
          <ul className={styles.lista}>
            {certificacoes.map((item) => (
              // Certificação expirada continua na lista, só que apagada e com aviso
              <li key={item.titulo} className={`${styles.item} ${item.expirada ? styles.expirada : ''}`}>
                <span className={styles.data}>{item.ano}</span>
                <span className={styles.titulo}>{item.titulo}</span>
                <span className={styles.origem}>
                  {item.emissor}
                  {item.expirada && ' · expirada'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Secao>
  )
}

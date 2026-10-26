import Secao from '../../components/Secao/Secao'
import { experiencia } from '../../data/experiencia'
import styles from './Experiencia.module.css'

// Trajetória no mesmo estilo "log" da Formação: período | cargo | empresa, com as conquistas abaixo
export default function Experiencia() {
  return (
    <Secao id="experiencia" indice="02" titulo="Experiência">
      <ol className={styles.lista}>
        {experiencia.map((item) => (
          <li key={`${item.empresa}-${item.cargo}`} className={styles.item}>
            <span className={styles.data}>{item.periodo}</span>
            <span className={styles.origem}>{item.empresa}</span>
            <h3 className={styles.titulo}>{item.cargo}</h3>
            <ul className={styles.conquistas}>
              {item.conquistas.map((conquista) => (
                <li key={conquista}>{conquista}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Secao>
  )
}

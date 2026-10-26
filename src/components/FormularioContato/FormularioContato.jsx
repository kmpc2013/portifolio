import { useState } from 'react'
import { perfil } from '../../data/perfil'
import { validar } from '../../utils/validarContato'
import styles from './FormularioContato.module.css'

const vazio = { nome: '', email: '', mensagem: '' }

export default function FormularioContato() {
  // Formulário controlado: o React guarda o valor de cada campo no estado
  const [campos, setCampos] = useState(vazio)
  const [erros, setErros] = useState({})
  const [enviado, setEnviado] = useState(false)

  // Um único handler para todos os campos: usa o "name" do input como chave
  function aoDigitar(evento) {
    const { name, value } = evento.target
    setCampos({ ...campos, [name]: value })
  }

  function aoEnviar(evento) {
    // Sem isso o navegador recarregaria a página ao enviar o formulário
    evento.preventDefault()

    const novosErros = validar(campos)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) {
      setEnviado(false)
      return
    }

    // Sem back-end: monta um link mailto: e abre o programa de e-mail do visitante.
    // encodeURIComponent troca espaços, acentos e quebras de linha por códigos válidos na URL.
    const assunto = encodeURIComponent(`Contato pelo portfólio - ${campos.nome}`)
    const corpo = encodeURIComponent(`${campos.mensagem}\n\n${campos.nome} (${campos.email})`)
    window.location.href = `mailto:${perfil.email}?subject=${assunto}&body=${corpo}`

    setEnviado(true)
    setCampos(vazio)
  }

  return (
    // noValidate desliga os balões nativos do navegador: quem valida é o React
    <form className={styles.formulario} onSubmit={aoEnviar} noValidate>
      <label className={styles.campo}>
        Nome
        <input
          name="nome"
          value={campos.nome}
          onChange={aoDigitar}
          autoComplete="name"
          aria-invalid={Boolean(erros.nome)}
        />
        {erros.nome && <span className={styles.erro}>{erros.nome}</span>}
      </label>

      <label className={styles.campo}>
        E-mail
        <input
          name="email"
          type="email"
          value={campos.email}
          onChange={aoDigitar}
          autoComplete="email"
          aria-invalid={Boolean(erros.email)}
        />
        {erros.email && <span className={styles.erro}>{erros.email}</span>}
      </label>

      <label className={styles.campo}>
        Mensagem
        <textarea
          name="mensagem"
          rows="5"
          value={campos.mensagem}
          onChange={aoDigitar}
          aria-invalid={Boolean(erros.mensagem)}
        />
        {erros.mensagem && <span className={styles.erro}>{erros.mensagem}</span>}
      </label>

      <button type="submit" className={`${styles.botao} cursor-target`}>
        Enviar mensagem <span aria-hidden="true">→</span>
      </button>

      {/* role="status" faz o leitor de tela anunciar a mensagem quando ela aparece */}
      <p role="status" className={styles.sucesso}>
        {enviado && 'Seu programa de e-mail foi aberto com a mensagem pronta. É só enviar!'}
      </p>
    </form>
  )
}

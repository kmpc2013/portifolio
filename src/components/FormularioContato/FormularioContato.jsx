import { useState } from 'react'
import { perfil } from '../../data/perfil'
import { validar } from '../../utils/validarContato'
import styles from './FormularioContato.module.css'

const vazio = { nome: '', email: '', mensagem: '' }

// Texto do <output> em cada situação do envio
const avisos = {
  ocioso: '',
  enviando: 'Enviando…',
  enviado: 'Mensagem enviada! Respondo em breve.',
  erro: 'Não foi possível enviar agora. Tente de novo ou escreva direto para',
}

export default function FormularioContato() {
  // Formulário controlado: o React guarda o valor de cada campo no estado
  const [campos, setCampos] = useState(vazio)
  const [erros, setErros] = useState({})
  // ocioso → enviando → enviado | erro
  const [situacao, setSituacao] = useState('ocioso')

  // Um único handler para todos os campos: usa o "name" do input como chave.
  // A forma funcional parte sempre do estado mais recente, mesmo com várias atualizações seguidas.
  function aoDigitar(evento) {
    const { name, value } = evento.target
    setCampos((atual) => ({ ...atual, [name]: value }))
  }

  async function aoEnviar(evento) {
    // Sem isso o navegador recarregaria a página ao enviar o formulário
    evento.preventDefault()

    const novosErros = validar(campos)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) {
      setSituacao('ocioso')
      return
    }

    // _gotcha: campo invisível. Gente não preenche; robô de spam preenche, e o Formspree descarta.
    const armadilha = evento.target.elements._gotcha?.value ?? ''

    setSituacao('enviando')
    try {
      // O site é estático: quem recebe a mensagem e manda para o meu e-mail é o Formspree
      const resposta = await fetch(perfil.formulario, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campos, _subject: `Contato pelo portfólio - ${campos.nome}`, _gotcha: armadilha }),
      })
      // fetch só rejeita em falha de rede: status 4xx/5xx precisa ser conferido aqui
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)

      setSituacao('enviado')
      setCampos(vazio)
    } catch {
      // Mantém o que a pessoa digitou para ela poder tentar de novo
      setSituacao('erro')
    }
  }

  const enviando = situacao === 'enviando'

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

      {/* Armadilha anti-spam: fora da tela, do teclado e do leitor de tela */}
      <input name="_gotcha" className={styles.armadilha} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button type="submit" className={`${styles.botao} cursor-target`} disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar mensagem'} <span aria-hidden="true">→</span>
      </button>

      {/* <output> tem papel "status": o leitor de tela anuncia a mensagem quando ela aparece */}
      <output className={situacao === 'erro' ? styles.falha : styles.sucesso}>
        {avisos[situacao]}
        {situacao === 'erro' && (
          <>
            {' '}
            <a href={`mailto:${perfil.email}`}>{perfil.email}</a>.
          </>
        )}
      </output>
    </form>
  )
}

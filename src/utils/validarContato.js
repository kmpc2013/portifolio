// Regras de validação do formulário de contato: função pura, sem React,
// por isso fica num arquivo próprio e é fácil de testar (ver validarContato.test.js).
// Recebe { nome, email, mensagem } e devolve um objeto só com os campos inválidos.
export function validar(campos) {
  const erros = {}
  if (campos.nome.trim().length < 2) erros.nome = 'Informe seu nome.'
  // Formato mínimo de e-mail: algo@algo.algo
  if (!/^\S+@\S+\.\S+$/.test(campos.email)) erros.email = 'Informe um e-mail válido.'
  if (campos.mensagem.trim().length < 10) erros.mensagem = 'A mensagem precisa ter pelo menos 10 caracteres.'
  return erros
}

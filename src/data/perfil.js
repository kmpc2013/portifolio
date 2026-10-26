// Dados pessoais num lugar só: trocar aqui atualiza todas as seções que os usam.
export const perfil = {
  nome: 'Luis Fernandes',
  cargo: 'Analista de Infraestrutura Sênior',
  resumo:
    'Mais de 10 anos em TI transformando problemas de infraestrutura em soluções completas: da análise à arquitetura, automação, segurança, deploy em produção e documentação.',
  sobre: [
    'Há mais de 7 anos atuo em um provedor de serviços gerenciados (MSP), onde evoluí de analista júnior a sênior sustentando ambientes críticos de vários clientes com VMware vSphere, Cloud Director, NSX, HPE Morpheus, Linux e Docker. Hoje lidero tecnicamente projetos de inovação e automação, da concepção à implantação, unindo infraestrutura e desenvolvimento de software.',
    'Entre as entregas, estão uma plataforma de AIOps com IA para correlação de alertas e redução de eventos duplicados, a centralização de identidades com Keycloak (SSO, MFA e Active Directory) e a evolução da observabilidade com Zabbix, Grafana e Loki.',
  ],
  // Frase de fechamento do Sobre: a palavra final alterna entre os estados da lista
  manifesto: {
    inicio: 'Uma entrega só termina quando está',
    estados: ['segura', 'monitorada', 'documentada', 'repassada'],
    fim: 'De forma que o time consiga manter e evoluir sem depender de mim.',
  },
  localizacao: 'Joinville, SC',
  email: 'luis.vidio9@gmail.com',
  github: 'https://github.com/kmpc2013',
  linkedin: 'https://www.linkedin.com/in/luis-gustavo-fernandes-99a42910b/',
  // Endpoint do Formspree que recebe o formulário de contato e encaminha para o e-mail acima.
  // O id é público (fica no HTML de qualquer forma): trocar SEU_ID pelo id do formulário criado no Formspree.
  formulario: 'https://formspree.io/f/SEU_ID',
  // Arquivo dentro de public/: o link é montado com o BASE_URL do Vite
  curriculo: 'curriculo-luis-fernandes.pdf',
  // O que procuro: aparece no Início e no Contato
  disponibilidade: ['Infraestrutura/DevOps Sênior', 'Remoto ou híbrido em Joinville', 'CLT ou PJ'],
}

// Ordem e rótulos do menu. O id precisa ser igual ao id de cada <Secao>.
export const secoes = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'sobre', rotulo: 'Sobre mim' },
  { id: 'experiencia', rotulo: 'Experiência' },
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'habilidades', rotulo: 'Habilidades' },
  { id: 'formacao', rotulo: 'Formação' },
  { id: 'contato', rotulo: 'Contato' },
]

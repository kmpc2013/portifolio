// Imagens importadas: o Vite gera o caminho final (com hash) no build.
import imgLoki from '../assets/projetos/logs-mtls.svg'
import imgCorrelacao from '../assets/projetos/correlacao.svg'
import imgGateway from '../assets/projetos/gateway-ia.svg'
import imgReporthub from '../assets/projetos/reporthub.svg'
import imgKeycloak from '../assets/projetos/sso-keycloak.svg'
import imgZmapl from '../assets/projetos/zmapl.svg'
import imgPetStyle from '../assets/projetos/pet-style.svg'
import imgMicrofrontends from '../assets/projetos/microfrontends.svg'

// Rótulo dos projetos feitos no curso de Front-end da EBAC (o currículo em PDF deixa esses de fora)
export const CURSO = 'Projeto do curso · EBAC'

// Cada objeto vira uma <LinhaProjeto>. Para adicionar um projeto, basta incluir um item.
// repositorio e demo: links externos; repositorio: null mostra "Repositório privado"; demo: null esconde o botão "Ver online".
// status: opcional; quando existe, aparece acima do título (ex.: CURSO ou "Em andamento").
// impacto: opcional; resultado em número (ex.: "−79% de peso"), aparece abaixo do título.
// relatorio: opcional; link para um PDF com a evidência do resultado.
export const projetos = [
  {
    id: 'logs-mtls',
    titulo: 'Plataforma de logs multi-cliente com mTLS',
    impacto: '+30 servidores centralizados',
    descricao:
      'Centralização de logs de servidores Windows e Linux de vários clientes num Loki próprio. Cada cliente é isolado por certificado mTLS, com revogação, e as configurações chegam aos agentes via Git, sem nenhuma credencial nas VMs. Inclui containers endurecidos, CI/CD por cliente com verificação depois do deploy, testes de segurança negativos e runbooks completos.',
    imagem: imgLoki,
    tecnologias: ['Grafana Loki', 'Grafana Alloy', 'mTLS', 'Git', 'Docker', 'CI/CD'],
    repositorio: null,
    demo: null,
    status: 'Em andamento',
  },
  {
    id: 'correlacao',
    titulo: 'Correlação de eventos: do alerta ao chamado único',
    impacto: '−70% de ruído operacional',
    descricao:
      'Reduz o ruído operacional agrupando os alertas do Zabbix por host num único chamado no ITSM. O título é gerado por LLM e o reconhecimento volta automaticamente ao Zabbix. São mais de 860 testes automatizados, pipeline com gates de qualidade e versionamento automático, e credenciais cifradas no banco.',
    imagem: imgCorrelacao,
    tecnologias: ['Zabbix', 'LLMs', 'ITSM', 'APIs REST', 'CI/CD'],
    repositorio: null,
    demo: null,
  },
  {
    id: 'gateway-ia',
    titulo: 'Gateway de IA corporativa on-premises',
    impacto: '0 dados enviados a terceiros',
    descricao:
      'IA generativa interna (LibreChat, Open WebUI e LiteLLM sobre vLLM) para que os dados não saiam da empresa. A borda tem TLS 1.3, HSTS, CSP e rate limit, e a migração foi conduzida com scripts de preflight, cutover e rollback documentados.',
    imagem: imgGateway,
    tecnologias: ['LibreChat', 'Open WebUI', 'LiteLLM', 'vLLM', 'Nginx', 'TLS 1.3'],
    repositorio: null,
    demo: null,
  },
  {
    id: 'reporthub',
    titulo: 'ReportHub: relatórios executivos sob demanda',
    impacto: 'Relatórios avançados em segundos',
    descricao:
      'Portal com SSO (Keycloak/OIDC) que gera relatórios executivos e dossiês de alerta a partir dos logs, com execução assíncrona, limites de concorrência e trilha de auditoria. Tem cerca de 130 testes e CI/CD com versionamento automático de imagens.',
    imagem: imgReporthub,
    tecnologias: ['Keycloak', 'OIDC', 'Docker', 'CI/CD'],
    repositorio: null,
    demo: null,
  },
  {
    id: 'sso-keycloak',
    titulo: 'Identidade única: SSO corporativo com Keycloak',
    impacto: '+6 sistemas e +150 usuários',
    descricao:
      'Login único com MFA para GitLab, Grafana, Zabbix, GLPI e ferramentas de IA, usando OIDC e SAML, com tema da marca. Cada integração tem guia próprio e há um procedimento de produção passo a passo.',
    imagem: imgKeycloak,
    tecnologias: ['Keycloak', 'OIDC', 'SAML', 'MFA', 'Active Directory'],
    repositorio: null,
    demo: null,
  },
  {
    id: 'zmapl',
    titulo: 'ZmapL: chamados inteligentes a partir do Zabbix',
    impacto: '+100 clientes mapeados',
    descricao:
      'Um único host do Zabbix monitorava jobs de backup de vários clientes, e os chamados automáticos saíam sem identificar o cliente. Criei um mapeamento que classifica cada chamado pelo cliente e serviço corretos, com um portal web para gerenciar esse mapeamento sem editar arquivos à mão, reduzindo erros.',
    imagem: imgZmapl,
    tecnologias: ['Zabbix (API)', 'Angular', 'Node.js', 'MySQL', 'Docker', 'Veeam', 'OTRS'],
    repositorio: 'https://github.com/kmpc2013/ZmapL',
    demo: null,
  },
  {
    id: 'pet-style',
    titulo: 'Pet&Style: performance de 90 para 100 no Lighthouse',
    impacto: '−79% de peso e LCP de 3,66 s para 1,21 s',
    descricao:
      'Landing page de produtos para pets medida, diagnosticada e otimizada com números. Imagens em AVIF e WebP com srcset e lazy loading, CSS do Tailwind minificado e embutido, HTML minificado e correção de contraste. Cada etapa é um commit, medida com 3 execuções do Lighthouse em mobile e desktop.',
    imagem: imgPetStyle,
    tecnologias: ['HTML', 'Tailwind CSS', 'Lighthouse', 'AVIF/WebP', 'Node.js (sharp)'],
    repositorio: 'https://github.com/kmpc2013/ebac-frontend-performance-e-otimizacao',
    demo: 'https://kmpc2013.github.io/ebac-frontend-performance-e-otimizacao/',
    status: CURSO,
  },
  {
    id: 'microfrontends',
    titulo: 'Restaurante: micro frontends com Module Federation',
    impacto: '3 apps publicáveis de forma independente',
    descricao:
      'Sistema de pedidos dividido em três aplicações Next.js: um container (host) que carrega o Cardápio e o Pedido em tempo de execução. Os micros não importam código um do outro e se comunicam só por um CustomEvent com contrato definido, ouvido por um hook com limpeza no useEffect. Cada micro é carregado com lazy/Suspense e protegido por um Error Boundary.',
    imagem: imgMicrofrontends,
    tecnologias: ['Next.js', 'React', 'Module Federation', 'Webpack 5', 'CSS Modules', 'npm workspaces'],
    repositorio: 'https://github.com/kmpc2013/ebac-frontend-microfrontends',
    demo: 'https://kmpc2013.github.io/ebac-frontend-microfrontends/',
    status: CURSO,
  },
]

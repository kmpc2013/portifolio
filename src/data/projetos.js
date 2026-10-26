// Imagens importadas: o Vite gera o caminho final (com hash) no build.
import imgTodo from '../assets/projetos/todo-nextjs.svg'
import imgPetStyle from '../assets/projetos/pet-style.svg'
import imgMicrofrontends from '../assets/projetos/microfrontends.svg'

// Rótulo dos projetos feitos no curso de Front-end da EBAC
const CURSO = 'Projeto do curso · EBAC'

// Cada objeto vira uma <LinhaProjeto>. Para adicionar um projeto, basta incluir um item.
// repositorio e demo: links externos; demo: null esconde o botão "Ver online".
// status: opcional; quando existe, aparece acima do título (ex.: CURSO ou "Em andamento").
// impacto: opcional; resultado em número (ex.: "−79% de peso"), aparece abaixo do título.
export const projetos = [
  {
    id: 'todo-nextjs',
    titulo: 'To-Do List com testes unitários em Next.js',
    impacto: 'Lint, testes e build a cada push',
    descricao:
      'Lista de tarefas em Next.js (App Router) e TypeScript: a página é um Server Component, o formulário é um Client Component controlado e o CRUD fica em Server Actions. Os testes com Jest e React Testing Library cobrem a camada de dados, os componentes, as páginas e um hook personalizado. O pipeline só publica na Vercel se lint, testes e build passarem.',
    imagem: imgTodo,
    tecnologias: ['Next.js', 'TypeScript', 'Jest', 'React Testing Library', 'GitHub Actions', 'Vercel'],
    repositorio: 'https://github.com/kmpc2013/ebac-frontend-testes-unitarios',
    demo: 'https://ebac-frontend-testes-unitarios.vercel.app/',
    status: CURSO,
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

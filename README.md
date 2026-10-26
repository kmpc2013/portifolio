# Portfólio — Luis Fernandes

[![Deploy no GitHub Pages](https://github.com/kmpc2013/portifolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/kmpc2013/portifolio/actions/workflows/deploy.yml)

Portfólio profissional de **Analista de Infraestrutura Sênior**, desenvolvido em React como projeto final do curso de Front-end da EBAC. O visual é de uma "sala de controle": fundo escuro, um terminal animado em WebGL e um único verde de status OK.

🔗 **Versão online:** https://kmpc2013.github.io/portifolio/

## Seções

- **Início:** nome, cargo, resumo profissional e atalhos para projetos e contato
- **Sobre mim:** foto, trajetória e dados de contato
- **Experiência:** cargos, períodos e principais conquistas
- **Projetos:** o próprio portfólio (pipeline e performance medida) e 3 projetos do curso da EBAC, cada um com descrição, tecnologias, diagrama e links
- **Habilidades:** tecnologias agrupadas em 6 áreas
- **Formação:** formação acadêmica e certificações
- **Contato:** formulário com validação, enviado pelo [Formspree](https://formspree.io), e links para LinkedIn, GitHub e e-mail

## Tecnologias

- **React 19:** componentes, props, `useState`, `useEffect`, `lazy`/`Suspense` e hooks personalizados (`useSecaoAtiva`, `useAposInteracao`)
- **Vite 8:** build e servidor de desenvolvimento
- **CSS Modules:** estilo isolado por componente, com variáveis CSS globais
- **[React Bits](https://reactbits.dev):** componentes animados (FaultyTerminal, Shuffle, ScrollReveal, ScrollVelocity, CurvedLoop e outros), com `gsap` e `motion`. Todos carregados sob demanda, fora do JS da primeira tela
- **View Transitions API:** animação nativa da imagem dos projetos (miniatura ⇄ ampliada), sem biblioteca
- **Vitest + Testing Library:** testes da validação, do formulário (com `fetch` simulado), das seções, das linhas de projeto e dos hooks
- **Oxlint + Prettier:** lint (regras de correção, código suspeito e acessibilidade) e formatação
- **GitHub Actions → GitHub Pages:** CI/CD a cada push na `main`

## Projetos apresentados

O próprio portfólio e três projetos feitos no curso de Front-end da EBAC, cada um com uma tecnologia em destaque:

| Projeto                             | O que é                                                                                                                  | Destaque                                             | Tecnologias                                                    | Links                                                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Este portfólio                      | Pipeline de deploy com quality gate e performance medida com o Lighthouse, otimização por etapas                         | **Performance mobile 35 → 91**                       | GitHub Actions, GitHub Pages, Lighthouse, Node.js, Vite, React | [Repositório](https://github.com/kmpc2013/portifolio) · [Relatório (PDF)](public/relatorio-performance-portfolio.pdf)                                            |
| To-Do List com testes unitários     | Lista de tarefas com Server Components, Server Actions e um hook personalizado, testada com Jest e React Testing Library | **CI/CD: lint, testes e build antes de cada deploy** | Next.js, TypeScript, Jest, RTL, GitHub Actions, Vercel         | [Repositório](https://github.com/kmpc2013/ebac-frontend-testes-unitarios) · [Online](https://ebac-frontend-testes-unitarios.vercel.app/)                         |
| Pet&Style: performance e otimização | Landing page medida, diagnosticada e otimizada com o Lighthouse, uma etapa por commit                                    | **Performance 90 → 100 e −79% de peso**              | HTML, Tailwind CSS, Lighthouse, AVIF/WebP                      | [Repositório](https://github.com/kmpc2013/ebac-frontend-performance-e-otimizacao) · [Online](https://kmpc2013.github.io/ebac-frontend-performance-e-otimizacao/) |
| Restaurante com micro frontends     | Container que carrega os micros Cardápio e Pedido em tempo de execução, que se comunicam por um CustomEvent              | **3 apps publicáveis de forma independente**         | Next.js, React, Module Federation, Webpack 5, CSS Modules      | [Repositório](https://github.com/kmpc2013/ebac-frontend-microfrontends)                                                                                          |

## Como rodar localmente

Pré-requisito: [Node.js](https://nodejs.org) 20.19 ou mais novo.

```bash
# Clonar o repositório
git clone https://github.com/kmpc2013/portifolio.git
cd portifolio

# Instalar as dependências
npm install

# Rodar em desenvolvimento (http://localhost:5173)
npm run dev

# Rodar os testes, o lint e a verificação de formatação
npm test
npm run lint
npm run format:check   # npm run format corrige

# Gerar e visualizar o build de produção (http://localhost:4173)
npm run build
npm run preview
```

## Deploy (CI/CD)

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) roda a cada push na `main`:

```
npm ci → lint → formatação → testes → build → deploy no GitHub Pages → release
```

Se o lint, a formatação ou algum teste falhar, nada é publicado.

### Releases

Depois do deploy, o script [`scripts/release.mjs`](scripts/release.mjs) cria uma release no GitHub com os commits desde a última tag. A versão segue os [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

| Mensagem do commit                                   | Exemplo                         | Versão        |
| ---------------------------------------------------- | ------------------------------- | ------------- |
| `feat!:` ou `BREAKING CHANGE` no corpo               | `feat!: novo layout`            | 2.0.0 → 3.0.0 |
| `feat:`                                              | `feat(projetos): adiciona blog` | 2.0.0 → 2.1.0 |
| `fix:`, `perf:`, `docs:`, `chore:`... ou sem prefixo | `fix: corrige link do LinkedIn` | 2.0.0 → 2.0.1 |

As notas são agrupadas em Novidades (`feat`), Correções (`fix`), Desempenho (`perf`) e Outras mudanças. Para conferir antes do push qual versão e quais notas vão sair:

```bash
node scripts/release.mjs notas-release.md
```

A versão do `package.json` não é atualizada pelo CI. A versão oficial é a da tag.

## Desempenho e acessibilidade

O que mudou:

- **Hero:** abre com uma imagem leve (`hero-poster.webp`) e texto puro. O terminal em WebGL, as letras embaralhando e os botões magnéticos são baixados em arquivos separados e só entram na primeira interação do visitante (mouse, toque, rolagem ou teclado).
- **Sobre:** o texto aparece pronto; as animações (ScrollReveal e RotatingText) entram depois da primeira interação.
- **Projetos:** a ampliação da imagem usa a View Transitions API nativa no lugar do `motion`, que saiu do JS da primeira tela (558 KB → 255 KB, ou 190 KB → 81 KB com gzip).
- **Abaixo da primeira tela:** o letreiro das habilidades, a faixa curva do contato e o cursor-mira são carregados sob demanda.
- **Fontes:** servidas pelo próprio site, com preload da fonte dos títulos.
- **Foto:** convertida para WebP (de 1,5 MB para 38 KB).

| Métrica (Lighthouse)     | Mobile antes | Mobile 1ª rodada | Mobile atual | Desktop antes | Desktop atual |
| ------------------------ | ------------ | ---------------- | ------------ | ------------- | ------------- |
| Performance              | 35           | 85               | **91**       | 61            | **100**       |
| Acessibilidade           | 93           | 100              | **100**      | 93            | **100**       |
| Boas práticas            | 100          | 100              | 100          | 100           | 100           |
| SEO                      | 100          | 100              | 100          | 100           | 100           |
| Total Blocking Time      | 6.481 ms     | 211 ms           | **138 ms**   | 964 ms        | **4 ms**      |
| Largest Contentful Paint | 6,82 s       | 3,54 s           | **3,22 s**   | 1,43 s        | **0,72 s**    |
| Peso total               | 1.831 KB     | 396 KB           | **339 KB**   | 1.832 KB      | **344 KB**    |

Medianas de 3 execuções do Lighthouse 13.5.0 no build local (`scripts/medir.mjs`). A 1ª rodada está detalhada em [`docs/relatorios/relatorio-antes-depois.pdf`](docs/relatorios/relatorio-antes-depois.pdf); as etapas seguintes, em `docs/relatorios/etapas/4-hero-estatico` e `5-view-transitions`.

O LCP mobile ainda está acima da meta de 2,5 s: a página é renderizada no navegador, então o texto só aparece depois que o JS carrega. O próximo passo seria gerar o HTML no build (pré-renderização).

## Estrutura

```
src/
├── assets/       # foto, poster do hero e diagramas dos projetos
├── components/   # componentes reutilizáveis (Cabecalho, LinhaProjeto, Secao, FormularioContato...)
│   └── reactbits/  # componentes animados do React Bits (com ajustes locais comentados)
├── data/         # conteúdo: perfil, experiência, projetos, habilidades e formação
├── hooks/        # useSecaoAtiva (menu) e useAposInteracao (adia os efeitos pesados)
├── sections/     # Inicio, Sobre, Experiencia, Projetos, Habilidades, Formacao, Contato
├── styles/       # CSS global (variáveis e reset)
├── test/         # configuração dos testes
└── utils/        # funções puras, como a validação do formulário
```

Para adicionar um projeto, inclua um objeto em `src/data/projetos.js` e a imagem em `src/assets/projetos/`. Os campos `status` ("Em andamento"), `impacto` (resultado em número) e `relatorio` (PDF de evidência) são opcionais.

## Contato

- LinkedIn: https://www.linkedin.com/in/luis-gustavo-fernandes-99a42910b/
- GitHub: https://github.com/kmpc2013
- E-mail: luis.vidio9@gmail.com

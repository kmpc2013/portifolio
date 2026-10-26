// Gera o currículo em PDF a partir dos dados do site (src/data), para os dois nunca ficarem diferentes.
//
// Uso:   npm run curriculo
// Roda sozinho antes de "npm run build" (script prebuild), então o deploy sempre leva o PDF atualizado.
//
// O layout fica em scripts/curriculo/Curriculo.jsx. Ele é carregado pelo próprio Vite (runnerImport)
// porque o Node não entende JSX nem os imports de imagem que os arquivos de src/data fazem.
import { renderToFile } from '@react-pdf/renderer'
import { createElement } from 'react'
import { runnerImport } from 'vite'

const { module } = await runnerImport('/scripts/curriculo/Curriculo.jsx')
const { perfil } = await runnerImport('/src/data/perfil.js').then((r) => r.module)

const destino = `public/${perfil.curriculo}`
await renderToFile(createElement(module.Curriculo), destino)
console.log(`Currículo gerado em ${destino}`)

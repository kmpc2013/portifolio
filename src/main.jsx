import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fontes variáveis hospedadas no próprio site (Fontsource): sem CSS externo bloqueando a renderização.
// O navegador só baixa o subconjunto de caracteres usado (latin), graças ao unicode-range.
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource-variable/jetbrains-mono'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

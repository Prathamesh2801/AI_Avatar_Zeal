import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Must be imported before App: the router is created at module scope and
// rewrites the hash, which would drop a flag written as `#/?nodownload=1`
// before it could be read.
import './hooks/useAppFlags'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

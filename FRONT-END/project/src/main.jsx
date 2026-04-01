import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Departamentos from './Departamentos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Departamentos/>
  </StrictMode>,
)

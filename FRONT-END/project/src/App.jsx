import { useState } from 'react'
import Cadastro from "./Cadastro";
import Login from "./Login";
import './App.css'
// Componente principal
function App() {
  // Hook de estado para armazenar mensagem do backend
  const [tela, setTela] = useState("home");
  // Retorno do componente
  return (
    <>
      {/* Cabeçalho */}
      <section id="cabecalho">
        <div>
          <h1>ALLFORONE</h1>
        </div>
      </section>
      {/* Centro de cadastro e login */}
      <section id="centro">
        {/* Botão de login */}
        <div>
          <button onClick={() => setTela("login")}>Login</button>
        </div>
        {/* Botão de cadastro */}
        <div>
          <button onClick={() => setTela("cadastro")}>Cadastro</button>
        </div>
      </section>
      {/* Tela de cadastro */}
      {tela === "cadastro" && <Cadastro />}
      {/* Tela de login */}
      {tela === "login" && <Login />}
      {/* Documentação GitHub */}
      <section id="documentacao">
        <div>
          <h2>Documentação</h2>
          <a href="https://github.com/Ilan-Ha/2026_maua_ecm252_ecm516_projeto_grupo1/blob/main/README.md">
            Link para o README do GithHb
          </a>
        </div>
      </section>
    </>
  )
}
export default App;
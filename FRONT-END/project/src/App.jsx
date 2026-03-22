import { useState } from 'react';
import Cadastro from "./Cadastro";
import Login from "./Login";
import Perfil from "./Perfil";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  // Hook de estado para armazenar mensagem do backend
  const [tela, setTela] = useState("home");
  // Hook de estado para armazenar mensagem do backend
  const [usuario, setUsuario] = useState(null);
  // Retorno do componente
  return (
    <div className="container text-center mt-5">
      {/* Cabeçalho */}
      <header className="mb-5">
        <h1 className="fw-bold">ALLFORONE</h1>
      </header>
      {/* Botões (só se não já estiver logado) */}
      {!usuario && (
        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setTela("login")}
          >
            Login
          </button>
          <button
            className="btn btn-success"
            onClick={() => setTela("cadastro")}
          >
            Cadastro
          </button>
        </div>
      )}
      {/* Botão de logout */}
      {usuario && (
        <button
          className="btn btn-danger mb-3"
          onClick={() => {
            setUsuario(null);
            setTela("home");
          }}
        >
          Logout
        </button>
      )}
      {/* Telas */}
      <div className="card p-4 shadow-sm">
        {tela === "cadastro" && <Cadastro />}
        {tela === "login" && (
          <Login setUsuario={setUsuario} setTela={setTela} />
        )}
        {tela === "perfil" && (
          <Perfil usuario={usuario} setUsuario={setUsuario} />
        )}
      </div>
      {/* Documentação */}
      <div className="mt-5">
        <h5>Documentação</h5>
        <a
          href="https://github.com/Ilan-Ha/2026_maua_ecm252_ecm516_projeto_grupo1/blob/main/README.md"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-dark mt-2"
        >
          Ver README
        </a>
      </div>
    </div>
  );
}
export default App;
import Cadastro from "./usuario/Cadastro";
import Login from "./usuario/Login";
import Perfil from "./usuario/Perfil";
import StatusLed from "./StatusLed";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./catalogo/Departamentos";
import DetalhesProduto from "./catalogo/DetalhesProduto";
import Historico from "./historico/Historico";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import config from "./config";
import Search from "./busca/Busca";

function App() {
  const svc = config.services;

  // Inicializa o usuário a partir do localStorage para persistir a sessão (F5)
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("usuario");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar usuário no App", e);
      }
    }
    return null;
  });

  return (
    <BrowserRouter>
      <StatusLed />
      <Routes>
        <Route path="/" element={<Departamentos />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/historico" element={<Historico />} />
        <Route path={svc.search.endpoints.search} element={<Search />}></Route>
        <Route path={svc.auth.endpoints.register} element={<Cadastro />} />
        <Route path={svc.auth.endpoints.login} element={<Login setUsuario={setUsuario} />} />
        <Route path={svc.user.endpoints.perfil} element={<Perfil usuario={usuario} setUsuario={setUsuario} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
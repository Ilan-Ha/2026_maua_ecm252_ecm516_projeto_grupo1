import Cadastro from "./usuario/Cadastro";
import Login from "./usuario/Login";
import Perfil from "./usuario/Perfil";
import StatusLed from "./StatusLed";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./catalogo/Departamentos";
import DetalhesProduto from "./catalogo/DetalhesProduto";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import config from "./config";
import Search from "./busca/Busca";
import Historico from "./historico/Historico";

// Componente principal
function App() {
  const svc = config.services;

  // Inicializa o estado lendo do localStorage para persistir logins após refresh
  const [usuario, setUsuario] = useState(() => {
    try {
      const saved = localStorage.getItem("usuario");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sincroniza o usuário em memória com a sessão local
  const updateUsuario = (user) => {
    setUsuario(user);
    if (user) {
      localStorage.setItem("usuario", JSON.stringify(user));
    } else {
      localStorage.removeItem("usuario");
    }
  };

  return (
    <BrowserRouter>
      <StatusLed />
      <Routes>
        <Route path="/" element={<Departamentos />} />
        <Route path="/produto/:id" element={<DetalhesProduto usuario={usuario} />} />
        <Route path={svc.search.endpoints.search} element={<Search />} />
        <Route path={svc.auth.endpoints.register} element={<Cadastro />} />
        <Route path={svc.auth.endpoints.login} element={<Login setUsuario={updateUsuario} />} />
        <Route path={svc.user.endpoints.perfil} element={<Perfil usuario={usuario} setUsuario={updateUsuario} />} />
        <Route path="/historico" element={<Historico usuario={usuario} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
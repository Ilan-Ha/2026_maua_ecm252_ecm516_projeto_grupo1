import Cadastro from "./usuario/Cadastro";
import Login from "./usuario/Login";
import Perfil from "./usuario/Perfil";
import StatusLed from "./StatusLed";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./catalogo/Departamentos";
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState } from "react";
import config from "./config";
import Search from "./busca/Busca";
// Componente principal
function App() {
  const svc = config.services
  const [usuario, setUsuario] = useState(null)
  return (
    <BrowserRouter>
    <StatusLed />
      <Routes>
        <Route path="/" element={<Departamentos />} />
        <Route path={svc.search.endpoints.search} element={<Search />}></Route>
        <Route path={svc.auth.endpoints.register} element={<Cadastro />} />
        <Route path={svc.auth.endpoints.login} element={<Login setUsuario={setUsuario} />} />
        <Route path={svc.user.endpoints.perfil} element={<Perfil usuario={usuario} setUsuario={setUsuario} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
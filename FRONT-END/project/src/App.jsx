import Cadastro from "./usuario/Cadastro";
import Login from "./usuario/Login";
import Perfil from "./usuario/Perfil";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./catalogo/Departamentos";
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState } from "react";
import config from "./config";
import Search from "./busca/Search";

function App() {
  const svc = config.services
  const [usuario, setUsuario] = useState(null)
  return (
    <BrowserRouter>
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

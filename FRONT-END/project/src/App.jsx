
import Cadastro from "./Cadastro";
import Login from "./Login";
import Perfil from "./Perfil";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./Departamentos";
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState } from "react";

function App() {
  const [usuario,setUsuario] = useState(null)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Departamentos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login setUsuario={setUsuario}/>} />
        <Route path="/perfil" element={<Perfil usuario={usuario} setUsuario={setUsuario}/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

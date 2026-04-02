
import Cadastro from "./Cadastro";
import Login from "./Login";
import Perfil from "./Perfil";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./Departamentos";
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Departamentos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

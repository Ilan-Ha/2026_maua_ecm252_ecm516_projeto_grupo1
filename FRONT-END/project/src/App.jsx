import Cadastro from "./usuario/Cadastro";
import Login from "./usuario/Login";
import Perfil from "./usuario/Perfil";
import StatusLed from "./StatusLed";
import "bootstrap/dist/css/bootstrap.min.css";
import Departamentos from "./catalogo/Departamentos";
import DetalhesProduto from "./catalogo/DetalhesProduto";
import Historico from "./historico/Historico";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import config from "./config";
import Search from "./busca/Busca";
import { AuthProvider } from "./auth/AuthContext.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";

function App() {
  const svc = config.services;

  return (
    <AuthProvider>
      <BrowserRouter>
        <StatusLed />
        <Routes>
          <Route path="/" element={<Departamentos />} />
          <Route path="/produto/:id" element={<DetalhesProduto />} />
          <Route
            path="/historico"
            element={
              <RequireAuth>
                <Historico />
              </RequireAuth>
            }
          />
          <Route path={svc.search.endpoints.search} element={<Search />} />
          <Route path={svc.auth.endpoints.register} element={<Cadastro />} />
          <Route path={svc.auth.endpoints.login} element={<Login />} />
          <Route
            path={svc.user.endpoints.perfil}
            element={
              <RequireAuth>
                <Perfil />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

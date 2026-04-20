import Cadastro from "./auth/Cadastro";
import Login from "./auth/Login";
import Departamentos from "./catalog/Departamentos";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import config from "./config";

export default function Header() {
  const svc = config.services
  return (
    <div className="header-bar">
      <div className="row align-items-center">
        <div className="col text-start ms-3">
          <div className="header-bar-container d-flex align-items-center">
            <img
              className="logo-header"
              src="AllForOne_Logo.png"
              alt="Logotipo do site AllForOne"
            />
          </div>
        </div>

        <div className="col text-center">
          <Link to={config.start} className="mx-3 text-decoration-none text-dark">
            Catalogo
          </Link>

          <Link to={svc.search.endpoints.search} className="mx-3 text-decoration-none text-dark">
            Comparação
          </Link>
        </div>

        <div className="col text-end me-3">
          <Link to={svc.auth.endpoints.login} className="text-decoration-none">
            <button className="btn btn-primary ms-1 btn-header bg-white text-dark border-black">
              Login
            </button>
          </Link>

          <Link to={svc.auth.endpoints.register} className="text-decoration-none">
            <button className="btn btn-success ms-1 btn-header">
              Cadastro
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import Cadastro from "./auth/Cadastro";
import Login from "./auth/Login";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import config from "./config";
import { useTranslation } from "react-i18next";

export default function Header() {
  const {i18n} = useTranslation()

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  const svc = config.services.auth.endpoints
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

        <div className="col text-end me-3">
          <select onChange={handleChange} value={i18n.language}>
            <option value="en-US">English (US)</option>
            <option value="pt-BR">Portugues (BR)</option>
          </select>
          
          <Link to={svc.login} className="text-decoration-none">
            <button className="btn btn-primary ms-1 btn-header bg-white text-dark border-black">
              Login
            </button>
          </Link>

          <Link to={svc.register} className="text-decoration-none">
            <button className="btn btn-success ms-1 btn-header">
              Cadastro
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

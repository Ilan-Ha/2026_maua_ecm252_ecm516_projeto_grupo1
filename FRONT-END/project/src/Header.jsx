import Cadastro from "./Cadastro";
import Login from "./Login";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function Header() {
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
          <Link to="/login" className="text-decoration-none">
            <button className="btn btn-primary ms-1 btn-header bg-white text-dark border-black">
              Login
            </button>
          </Link>

          <Link to="/cadastro" className="text-decoration-none">
            <button className="btn btn-success ms-1 btn-header">
              Cadastro
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

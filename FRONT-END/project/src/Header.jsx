import { useState } from "react";
import Cadastro from "./Cadastro";
import Login from "./Login";

export default function Header() {
  const [tela, setTela] = useState("departamentos");

  if (tela === "cadastro") {
    return <Cadastro></Cadastro>;
  }

  if (tela === "login") {
    return <Login></Login>;
  }

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
          <button
            className="btn btn-primary ms-1 btn-header bg-white text-dark border-black"
            onClick={() => setTela("login")}
          >
            Login
          </button>
          <button
            className="btn btn-success ms-1 btn-header"
            onClick={() => setTela("cadastro")}
          >
            Cadastro
          </button>
        </div>
      </div>
    </div>
  );
}

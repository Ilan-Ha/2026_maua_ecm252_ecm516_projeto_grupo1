import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import config from "./config";

export default function Header() {
  const svc = config.services;
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("usuario");
    if (saved) {
      try {
        setUsuario(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar usuário", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="header-bar">
      <div className="row align-items-center">
        <div className="col text-start ms-3">
          <div className="header-bar-container d-flex align-items-center">
            <Link to={config.start}>
              <img
                className="logo-header"
                src="/AllForOne_Logo.png"
                alt="Logotipo do site AllForOne"
                style={{ cursor: "pointer" }}
              />
            </Link>
          </div>
        </div>

        <div className="col text-center d-flex align-items-center justify-content-center">
          <Link to={config.start} className="mx-3 text-decoration-none text-dark fw-bold">
            Catálogo
          </Link>

          <Link to={svc.search.endpoints.search} className="mx-3 text-decoration-none text-dark fw-bold">
            Comparação
          </Link>

          <Link to="/historico" className="mx-3 text-decoration-none text-dark fw-bold" style={{ color: "#377f3f" }}>
            Histórico
          </Link>
        </div>

        <div className="col text-end me-3">
          {usuario ? (
            <div className="d-flex align-items-center justify-content-end gap-2">
              <Link to={svc.user.endpoints.perfil} className="text-decoration-none">
                <button
                  className="btn btn-outline-success ms-1 btn-header fw-semibold d-flex align-items-center gap-1"
                  style={{ borderColor: "#377f3f", color: "#377f3f" }}
                >
                  {usuario.nome.split(" ")[0]}
                </button>
              </Link>
              <button onClick={handleLogout} className="btn btn-danger ms-1 btn-header">
                Sair
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

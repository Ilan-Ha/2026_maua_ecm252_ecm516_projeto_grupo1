import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "./config";

export default function Header() {
  const svc = config.services;
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Carrega o usuário logado para renderizar o Header condicionalmente
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) {
      try {
        setUsuario(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário no Header:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
    window.location.reload(); // Recarrega para limpar estados e atualizar componentes
  };

  return (
    <div className="header-bar">
      <div className="row align-items-center">
        <div className="col text-start ms-3">
          <Link to={config.start} className="header-bar-container d-flex align-items-center text-decoration-none">
            <img
              className="logo-header"
              src="/AllForOne_Logo.png"
              alt="Logotipo do site AllForOne"
            />
          </Link>
        </div>

        <div className="col text-center d-flex justify-content-center align-items-center">
          <Link to={config.start} className="mx-3 text-decoration-none text-dark fw-semibold">
            Catálogo
          </Link>

          <Link to={svc.search.endpoints.search} className="mx-3 text-decoration-none text-dark fw-semibold">
            Comparação
          </Link>

          <Link to="/historico" className="mx-3 text-decoration-none text-dark fw-semibold">
            Histórico
          </Link>
        </div>

        <div className="col text-end me-3">
          {usuario ? (
            <div className="d-flex align-items-center justify-content-end gap-2">
              <Link 
                to={svc.user.endpoints.perfil} 
                className="text-decoration-none text-dark fw-bold me-2"
                style={{ fontSize: "0.95rem" }}
              >
                Olá, {usuario.nome ? usuario.nome.split(" ")[0] : "Usuário"}
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger btn-header py-1 px-3"
                style={{ borderRadius: "20px" }}
              >
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


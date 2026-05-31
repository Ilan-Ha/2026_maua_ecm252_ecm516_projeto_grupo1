import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Header.jsx";

export default function Historico() {
  const [historicoVistos, setHistoricoVistos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega os dados salvos do localStorage ou do backend
  useEffect(() => {
    setLoading(true);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

    if (usuario && usuario._id) {
      // Busca do backend usando GET na /requisicao do gateway
      const url = `http://localhost:10000/requisicao?request=/historico&userId=${usuario._id}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data.error && data.content) {
            setHistoricoVistos(data.content);
          } else {
            console.error("Erro ao buscar histórico do backend", data.message);
          }
        })
        .catch(err => console.error("Erro na requisição de histórico", err))
        .finally(() => setLoading(false));
    } else {
      try {
        const vistosLocais = JSON.parse(localStorage.getItem("allforone_history_produtos") || "[]");
        setHistoricoVistos(vistosLocais);
      } catch (err) {
        console.error("Erro ao ler histórico do localStorage", err);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Limpa o histórico de produtos
  const handleLimparHistorico = () => {
    const confirmar = window.confirm("Tem certeza que deseja limpar o histórico de produtos vistos?");
    if (!confirmar) return;

    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

    if (usuario && usuario._id) {
      // Limpa no backend
      const url = `http://localhost:10000/requisicao`;
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request: "/historico/limpar",
          payload: { userId: usuario._id }
        })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setHistoricoVistos([]);
        } else {
          console.error("Erro ao limpar histórico do backend", data.message);
        }
      })
      .catch(err => console.error("Erro na requisição para limpar histórico", err));
    } else {
      localStorage.removeItem("allforone_history_produtos");
      setHistoricoVistos([]);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column bg-light pb-5">
      <Header />

      <div className="container mt-5 flex-grow-1 text-start">
        {/* Cabeçalho da Página */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: "#377f3f", fontFamily: "Roboto, sans-serif" }}>
              Histórico de Produtos Vistos
            </h2>
            <p className="text-muted mb-0">
              Revise os produtos que você acessou recentemente
            </p>
          </div>
          {historicoVistos.length > 0 && (
            <button
              onClick={handleLimparHistorico}
              className="btn btn-outline-danger px-4 rounded-pill fw-semibold shadow-sm align-self-start"
            >
              Limpar Histórico
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="card border-0 rounded-4 shadow-sm p-4 bg-white">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Carregando seus acessos...</p>
            </div>
          ) : historicoVistos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="fw-bold mb-1 text-dark" style={{ fontSize: "1.1rem" }}>Seu histórico está vazio.</p>
              <p className="small mb-3 text-muted">
                Navegue pelas categorias do site e clique em produtos para registrá-los aqui!
              </p>
              <Link to="/" className="btn btn-sm text-white rounded-pill px-4" style={{ backgroundColor: "#377f3f" }}>
                Ir para o Catálogo
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {historicoVistos.map((item, i) => (
                <div className="col" key={i}>
                  <div
                    className="card h-100 border rounded-3 shadow-sm overflow-hidden d-flex flex-row p-3 align-items-center"
                    style={{ transition: "box-shadow 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(55,127,63,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
                  >
                    <img
                      src={item.imagem || "https://placehold.co/100"}
                      alt={item.nome}
                      style={{ width: "80px", height: "80px", objectFit: "contain", flexShrink: 0 }}
                      className="rounded border bg-white p-1"
                    />
                    <div className="ms-3 flex-grow-1 text-start">
                      {item.categoriaTag && (
                        <span className="badge bg-success-subtle text-success mb-1" style={{ fontSize: "0.72rem" }}>
                          {item.categoriaTag}
                        </span>
                      )}
                      <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ maxWidth: "190px" }}>{item.nome}</h6>
                      {item.marca && <small className="text-muted d-block">{item.marca}</small>}
                      {item.precoMedio && (
                        <p className="text-success fw-bold mb-1 mt-1" style={{ fontSize: "0.9rem" }}>
                          R$ {item.precoMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                      <Link
                        to={`/produto/${item._id}`}
                        className="btn btn-link text-success p-0 fw-semibold text-decoration-none"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Ver detalhes →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


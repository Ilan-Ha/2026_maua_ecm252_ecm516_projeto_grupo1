import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import config from "../config.jsx";

function Estrelas({ valor, max = 5, tamanho = "1.1rem", interativo = false, onChange }) {
  return (
    <span className="d-inline-flex gap-1" role={interativo ? "group" : undefined}>
      {Array.from({ length: max }, (_, i) => {
        const nota = i + 1;
        const preenchida = nota <= valor;
        return (
          <button
            key={nota}
            type="button"
            className="btn p-0 border-0 bg-transparent"
            style={{
              fontSize: tamanho,
              color: preenchida ? "#377f3f" : "#ccc",
              lineHeight: 1,
              cursor: interativo ? "pointer" : "default",
            }}
            disabled={!interativo}
            onClick={() => interativo && onChange?.(nota)}
            aria-label={`${nota} estrela${nota > 1 ? "s" : ""}`}
          >
            {preenchida ? "★" : "☆"}
          </button>
        );
      })}
    </span>
  );
}

function formatarData(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewSection({ produtoId }) {
  const svc = config.services.review;
  const loginPath = config.services.auth.endpoints.login;
  const reviewBase = config.url + ":" + svc.port;

  const [dados, setDados] = useState({ mediaEstrelas: 0, total: 0, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("usuario");
      if (saved) setUsuario(JSON.parse(saved));
    } catch {
      setUsuario(null);
    }
  }, []);

  const carregarReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${reviewBase}${svc.endpoints.list}/${produtoId}`
      );
      if (!res.ok) throw new Error("Falha ao carregar");
      const json = await res.json();
      setDados(json);
    } catch {
      setDados({ mediaEstrelas: 0, total: 0, reviews: [] });
    } finally {
      setLoading(false);
    }
  }, [produtoId, reviewBase, svc.endpoints.list]);

  useEffect(() => {
    carregarReviews();
  }, [carregarReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    setEnviando(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      const res = await fetch(`${reviewBase}${svc.endpoints.create}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produtoId,
          email: usuario.email,
          nome: usuario.nome,
          estrelas,
          comentario,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          typeof data.message === "string"
            ? data.message
            : "Erro ao enviar avaliação";
        setMensagem({ tipo: "danger", texto: msg });
        return;
      }

      setMensagem({ tipo: "success", texto: data.message || "Avaliação salva" });
      setComentario("");
      await carregarReviews();
    } catch {
      setMensagem({ tipo: "danger", texto: "Erro ao conectar com o servidor" });
    } finally {
      setEnviando(false);
    }
  };

  const textoMedia =
    dados.total === 0
      ? "Sem avaliações ainda"
      : `${dados.mediaEstrelas.toFixed(1)} · ${dados.total} avaliação${dados.total !== 1 ? "ões" : ""}`;

  return (
    <div className="card rounded-4 shadow-sm p-4 mt-4">
      <h4 className="fw-bold mb-3" style={{ color: "#377f3f" }}>
        Avaliações
      </h4>

      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-success" role="status" />
          <span className="ms-2 text-muted">Carregando avaliações...</span>
        </div>
      ) : (
        <>
          <div
            className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3"
            style={{ backgroundColor: "#e8f6e4" }}
          >
            <Estrelas
              valor={Math.round(dados.mediaEstrelas)}
              tamanho="1.4rem"
            />
            <span className="text-muted fw-semibold">{textoMedia}</span>
          </div>

          {usuario ? (
            <form onSubmit={handleSubmit} className="mb-4 pb-4 border-bottom">
              <p className="fw-semibold mb-2">Sua avaliação</p>
              <div className="mb-3">
                <label className="form-label text-muted small">Estrelas</label>
                <div>
                  <Estrelas
                    valor={estrelas}
                    interativo
                    tamanho="1.5rem"
                    onChange={setEstrelas}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="review-comentario" className="form-label text-muted small">
                  Comentário
                </label>
                <textarea
                  id="review-comentario"
                  className="form-control"
                  rows={3}
                  placeholder="Conte sua experiência com este produto..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                  minLength={3}
                  maxLength={500}
                />
              </div>
              {mensagem.texto && (
                <div className={`alert alert-${mensagem.tipo} py-2`} role="alert">
                  {mensagem.texto}
                </div>
              )}
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: "#377f3f" }}
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviar avaliação"}
              </button>
            </form>
          ) : (
            <p className="text-muted mb-4 pb-4 border-bottom">
              <Link to={loginPath} className="text-decoration-none fw-semibold" style={{ color: "#377f3f" }}>
                Faça login
              </Link>{" "}
              para avaliar este produto.
            </p>
          )}

          {dados.reviews.length === 0 ? (
            <p className="text-muted mb-0">Nenhum comentário ainda. Seja o primeiro!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {dados.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border rounded-3 p-3 bg-light bg-opacity-50"
                >
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                    <div>
                      <strong className="text-dark">{review.nome}</strong>
                      <div className="mt-1">
                        <Estrelas valor={review.estrelas} tamanho="0.95rem" />
                      </div>
                    </div>
                    <small className="text-muted">{formatarData(review.updatedAt || review.createdAt)}</small>
                  </div>
                  <p className="mb-0 text-secondary">{review.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

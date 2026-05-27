import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../Header.jsx";
import config from "../config.jsx";

// Salva o acesso ao produto no localStorage e no backend
function registrarAcesso(produto) {
  try {
    const CHAVE = "allforone_history_produtos";
    const historico = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    // Remove entrada anterior do mesmo produto para não duplicar
    const filtrado = historico.filter(item => item._id !== produto._id);
    // Insere no início com timestamp
    filtrado.unshift({
      _id: produto._id,
      nome: produto.nome,
      marca: produto.marca || "",
      imagem: produto.imagem || "",
      precoMedio: produto.precoMedio || 0,
      categoriaTag: produto.categoriaTag || "",
      acessadoEm: new Date().toISOString()
    });
    // Mantém no máximo 50 itens
    localStorage.setItem(CHAVE, JSON.stringify(filtrado.slice(0, 50)));
  } catch (err) {
    console.error("Erro ao salvar histórico local:", err);
  }

  // Persiste no backend (silencioso: falhas não afetam a experiência)
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const svcHistory = config.services.history;
    const url = config.url + ":" + svcHistory.port + svcHistory.endpoints.history;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: usuario?.email || "anonimo",
        _id: produto._id,
        nome: produto.nome,
        marca: produto.marca || "",
        imagem: produto.imagem || "",
        precoMedio: produto.precoMedio || 0,
        categoriaTag: produto.categoriaTag || ""
      })
    }).catch(() => {}); // Ignora erros de rede silenciosamente
  } catch { /* Ignora */ }
}

export default function DetalhesProduto() {
  const { id } = useParams();
  const svc = config.services.catalog;
  const baseUrl = config.url + ":" + svc.port;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/produto/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Produto não encontrado");
        return res.json();
      })
      .then((data) => {
        setProduto(data);
        setLoading(false);
        // Registra o acesso assim que o produto carrega
        registrarAcesso(data);
      })
      .catch((err) => {
        setErro(err.message);
        setLoading(false);
      });
  }, [id]);


  if (loading) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="text-center mt-5">
          <h3>Produto não encontrado</h3>
          <Link to="/" className="btn btn-success mt-3">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header />

      <div className="container mt-4 mb-5">
        {/* Botão Voltar */}
        <Link to="/" className="btn btn-outline-secondary mb-3">
          ← Voltar
        </Link>

        <div className="row g-4">
          {/* Imagem do Produto */}
          <div className="col-md-5">
            <div className="card rounded-4 shadow-sm p-3">
              <img
                src={produto.imagem || "https://placehold.co/400"}
                alt={produto.nome}
                className="img-fluid rounded-3"
                style={{ objectFit: "contain", maxHeight: "400px", width: "100%" }}
              />
            </div>

            {/* Galeria de imagens extras */}
            {produto.imagens && produto.imagens.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto">
                {produto.imagens.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${produto.nome} - ${i + 1}`}
                    className="rounded-3 border"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setProduto((prev) => ({ ...prev, imagem: img }))
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="col-md-7">
            <div className="card rounded-4 shadow-sm p-4">
              {/* Nome e Marca */}
              <span
                className="badge mb-2"
                style={{ backgroundColor: "#377f3f", width: "fit-content" }}
              >
                {produto.categoriaTag}
              </span>
              <h2
                className="fw-bold mb-1"
                style={{ color: "#377f3f", fontSize: "1.8rem" }}
              >
                {produto.nome}
              </h2>
              {produto.marca && (
                <p className="text-muted mb-3">
                  Marca: <strong>{produto.marca}</strong>
                  {produto.lancamento && ` • Lançamento: ${produto.lancamento}`}
                </p>
              )}

              {/* Descrição */}
              {produto.descricao && (
                <p className="mb-3" style={{ fontSize: "1.05rem" }}>
                  {produto.descricao}
                </p>
              )}

              {/* Preço Médio */}
              {produto.precoMedio && (
                <div
                  className="p-3 rounded-3 mb-3"
                  style={{ backgroundColor: "#e8f6e4" }}
                >
                  <span className="text-muted">Preço médio:</span>
                  <h3 className="fw-bold mb-0" style={{ color: "#377f3f" }}>
                    R$ {produto.precoMedio.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </h3>
                </div>
              )}

              {/* Especificações */}
              {produto.especificacoes &&
                Object.keys(produto.especificacoes).length > 0 && (
                  <div className="mb-3">
                    <h5 className="fw-bold mb-2">Especificações</h5>
                    <table className="table table-sm table-striped">
                      <tbody>
                        {Object.entries(produto.especificacoes).map(
                          ([chave, valor]) => (
                            <tr key={chave}>
                              <td
                                className="fw-semibold text-capitalize"
                                style={{ width: "40%" }}
                              >
                                {chave.replace(/([A-Z])/g, " $1").trim()}
                              </td>
                              <td>
                                {typeof valor === "boolean"
                                  ? valor
                                    ? "✔ Sim"
                                    : "✘ Não"
                                  : String(valor)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              {/* Sites de Compra */}
              {produto.sitesCompra && produto.sitesCompra.length > 0 && (
                <div>
                  <h5 className="fw-bold mb-2">Onde comprar</h5>
                  <div className="d-flex flex-column gap-2">
                    {produto.sitesCompra.map((site, i) => (
                      <a
                        key={i}
                        href={site.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-success d-flex justify-content-between align-items-center"
                      >
                        <span>{site.loja}</span>
                        <strong>
                          R$ {site.preco.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </strong>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header.jsx";
import { historyService } from "../services/historyService.js";

export default function Historico({ usuario }) {
  const [historyItems, setHistoryItems] = useState(() => {
    // Carrega sincrono do localStorage, sem necessidade de loading state
    const data = historyService.getHistory(usuario);
    return Array.isArray(data)
      ? data.sort((a, b) => new Date(b.acessadoEm) - new Date(a.acessadoEm))
      : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Função para deletar um item específico
  const handleDeleteItem = (produtoId) => {
    if (window.confirm("Deseja realmente remover este item do histórico?")) {
      historyService.deleteItem(usuario, produtoId);
      setHistoryItems(prev => prev.filter(item => item.produtoId !== produtoId));
      showFeedback("Produto removido do histórico");
    }
  };

  // Função para limpar todo o histórico
  const handleClearHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o seu histórico de acessos? Esta ação não pode ser desfeita.")) {
      historyService.clearHistory(usuario);
      setHistoryItems([]);
      showFeedback("Histórico limpo com sucesso");
    }
  };

  // Helper para exibir feedback temporário
  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  // Formatação de data e hora
  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "";
    }
  };

  // Filtra itens com base na busca do usuário
  const filteredItems = historyItems.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.nome.toLowerCase().includes(term) ||
      (item.marca && item.marca.toLowerCase().includes(term)) ||
      (item.categoriaTag && item.categoriaTag.toLowerCase().includes(term))
    );
  });

  // Agrupamento por datas
  const groupByDate = (items) => {
    const groups = { hoje: [], ontem: [], estaSemana: [], anteriores: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    items.forEach(item => {
      const d = new Date(item.acessadoEm);
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (day.getTime() === today.getTime()) groups.hoje.push(item);
      else if (day.getTime() === yesterday.getTime()) groups.ontem.push(item);
      else if (d >= sevenDaysAgo) groups.estaSemana.push(item);
      else groups.anteriores.push(item);
    });
    return groups;
  };

  const groups = groupByDate(filteredItems);
  const totalAccessed = historyItems.length;

  return (
    <div className="container-fluid">
      <Header />

      {/* Reutiliza a estrutura de .auth-page do projeto */}
      <div className="auth-page" style={{ flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "860px" }}>

          {/* Cabeçalho — reutiliza .auth-card */}
          <div className="auth-card mb-4" style={{ maxWidth: "100%", textAlign: "left" }}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
              <div>
                {/* Reutiliza .auth-title */}
                <h2 className="auth-title" style={{ textAlign: "left" }}>
                  Histórico de Acessos
                </h2>
                <p className="auth-subtitle" style={{ textAlign: "left", marginBottom: 0 }}>
                  {usuario
                    ? `Produtos acessados por ${usuario.nome} (${usuario.email})`
                    : "Produtos acessados recentemente neste dispositivo"}
                </p>
              </div>
              {totalAccessed > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="btn btn-outline-danger btn-sm"
                  style={{ borderRadius: "999px", fontWeight: "600", alignSelf: "center" }}
                >
                  Limpar Histórico
                </button>
              )}
            </div>

            {/* Feedback — reutiliza .auth-alert */}
            {feedbackMsg && (
              <div className="alert alert-success auth-alert" role="alert">
                ✓ {feedbackMsg}
              </div>
            )}

            {/* Campo de busca — reutiliza .auth-input */}
            {totalAccessed > 0 && (
              <div className="mt-3">
                <input
                  type="text"
                  className="auth-input w-100"
                  placeholder="Filtrar por nome, marca ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
                  Mostrando {filteredItems.length} de {totalAccessed} produto{totalAccessed !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Histórico Vazio — reutiliza .auth-card */}
          {totalAccessed === 0 && (
            <div className="auth-card" style={{ maxWidth: "100%", textAlign: "center" }}>
              <h4 style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", fontWeight: "700", marginBottom: "0.5rem" }}>
                Seu histórico está vazio
              </h4>
              <p className="auth-subtitle">
                Você ainda não visitou nenhum produto. Explore o catálogo e veja especificações detalhadas!
              </p>
              {/* Reutiliza .auth-submit */}
              <Link to="/" className="auth-submit" style={{ display: "inline-block", textDecoration: "none", textAlign: "center" }}>
                Explorar Catálogo
              </Link>
            </div>
          )}

          {/* Nenhum resultado na busca */}
          {totalAccessed > 0 && filteredItems.length === 0 && (
            <div className="auth-card" style={{ maxWidth: "100%", textAlign: "center" }}>
              <p className="auth-subtitle">Nenhum produto corresponde à busca "{searchTerm}".</p>
              <button onClick={() => setSearchTerm("")} className="auth-submit" style={{ width: "auto", padding: "0.5rem 1.5rem" }}>
                Limpar Busca
              </button>
            </div>
          )}

          {/* Listagem por grupos de data */}
          {filteredItems.length > 0 && (
            <div>
              {[
                { label: "Hoje", items: groups.hoje },
                { label: "Ontem", items: groups.ontem },
                { label: "Esta Semana", items: groups.estaSemana },
                { label: "Anteriores", items: groups.anteriores },
              ].map(({ label, items }) =>
                items.length > 0 ? (
                  <div key={label} className="mb-4">
                    {/* Título do grupo — reutiliza cor do projeto */}
                    <h5
                      className="fw-bold mb-3 text-start"
                      style={{
                        color: "#377f3f",
                        borderBottom: "2px solid #e8f6e4",
                        paddingBottom: "0.4rem",
                        textTransform: "uppercase",
                        fontSize: "0.85rem",
                        letterSpacing: "1px",
                      }}
                    >
                      {label}
                    </h5>
                    <div className="d-flex flex-column gap-3">
                      {items.map((item, index) => (
                        <HistoryRow
                          key={index}
                          item={item}
                          onView={`/produto/${item.produtoId}`}
                          onDelete={() => handleDeleteItem(item.produtoId)}
                          formatTime={formatTime}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Card de item do histórico — reutiliza .card .custom-body.item-card e .card-title.item-card-title do projeto
function HistoryRow({ item, onView, onDelete, formatTime, formatDate }) {
  return (
    <div className="card shadow-sm text-start" style={{ borderRadius: "0.75rem", borderLeft: "4px solid #377f3f", overflow: "hidden" }}>
      <div className="row g-0 align-items-center">

        {/* Imagem do produto */}
        <div className="col-auto d-flex align-items-center justify-content-center p-3" style={{ width: "100px" }}>
          <div className="custom-body item-card d-flex align-items-center justify-content-center rounded-3" style={{ width: "76px", height: "76px" }}>
            <img
              src={item.imagem || "https://placehold.co/80"}
              alt={item.nome}
              className="img-fluid"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Informações */}
        <div className="col p-3">
          {item.categoriaTag && (
            <span
              className="badge mb-1"
              style={{ backgroundColor: "#e8f6e4", color: "#377f3f", borderRadius: "999px", fontSize: "0.72rem", fontWeight: "700" }}
            >
              {item.categoriaTag}
            </span>
          )}
          {/* Reutiliza .card-title.item-card-title */}
          <div className="card-title item-card-title fw-bold mb-1" style={{ fontSize: "1rem" }}>
            {item.nome}
          </div>
          {item.marca && (
            <p className="text-muted small mb-1">Marca: {item.marca}</p>
          )}
          <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
            Acessado em: <strong>{formatDate(item.acessadoEm)} às {formatTime(item.acessadoEm)}</strong>
          </p>
        </div>

        {/* Preço médio */}
        {item.precoMedio > 0 && (
          <div className="col-auto p-3 text-end">
            <span className="text-muted small d-block">Preço Médio</span>
            <span className="fw-bold" style={{ color: "#377f3f", fontSize: "1rem" }}>
              R$ {item.precoMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Botões de ação */}
        <div className="col-auto p-3 d-flex flex-column gap-2">
          <Link to={onView} className="btn btn-success btn-sm" style={{ borderRadius: "999px", backgroundColor: "#377f3f", borderColor: "#377f3f", fontWeight: "600" }}>
            Ver detalhes
          </Link>
          <button
            onClick={onDelete}
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "999px" }}
            title="Remover do histórico"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

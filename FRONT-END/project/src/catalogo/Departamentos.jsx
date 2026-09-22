import ItemCard from "./CartaoDeItem.jsx";
import Header from "../Header.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import config, { apiBase } from "../config.jsx";
// Componente da Página
const Page = (props) => {
  return (
    <div className="container-fluid">
      <Header />
      <div className="header" style={{ padding: "3rem 1rem" }}>
        <h2 className="title-departamentos">CATEGORIAS DE PRODUTOS</h2>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          Explore especificações técnicas e detalhes por categoria
        </p>
        {/* barra de busca */}
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoria"
          value={props.search}
          onChange={props.onSearchChange}
          style={{
            borderRadius: "1.5rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        />
      </div>
      {/* grid centralizado */}
      <div className="bottom">
        <div className="container-fluid">
          <div className="row row-cols-2 row-cols-lg-4 g-2">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
// Componente Departamentos
export default function Departamentos() {
  const svc = config.services.catalog;
  const url = apiBase + svc.endpoints.catalog;
  const [data, setData] = useState(null);
  const [tag, setTag] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErro(null);

    fetch(url)
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(json?.error || json?.message || "Catálogo indisponível");
        }
        if (!json || !Array.isArray(json.Categorias)) {
          throw new Error("Resposta inválida do catálogo");
        }
        return json;
      })
      .then((json) => {
        if (!cancelled) {
          setData({
            Categorias: json.Categorias,
            Itens: json.Itens && typeof json.Itens === "object" ? json.Itens : {},
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar catálogo:", err);
        if (!cancelled) {
          setData(null);
          setErro(err.message || "Erro ao carregar catálogo");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <Page search={search} onSearchChange={(e) => setSearch(e.target.value)}>
        <p>Carregando catálogo...</p>
      </Page>
    );
  }

  if (erro || !data) {
    return (
      <Page search={search} onSearchChange={(e) => setSearch(e.target.value)}>
        <div className="col-12 text-center py-4">
          <p className="text-muted mb-2">{erro || "Catálogo indisponível"}</p>
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </Page>
    );
  }

  const renderCatalog = () => {
    if (tag !== null) {
      const items = data.Itens?.[tag] || [];
      return (
        <>
          <button onClick={() => setTag(null)}>Voltar</button>
          {items.map((item, i) => (
            <div className="col" key={i}>
              <ItemCard img={item.imagem} itemName={item.nome} itemLink={`/produto/${item._id}`} />
            </div>
          ))}
        </>
      );
    }

    const categorias = data.Categorias || [];
    const filtered = categorias.filter((item) =>
      (item.nome || "").toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length === 0) {
      return (
        <div className="col-12">
          <p className="text-muted">Nenhuma categoria encontrada.</p>
        </div>
      );
    }

    return filtered.map((item, i) => (
      <div className="col" key={i}>
        <div onClick={() => setTag(item.tag)}>
          <ItemCard img={item.imagem} itemName={item.nome} />
        </div>
      </div>
    ));
  };

  return (
    <Page search={search} onSearchChange={(e) => setSearch(e.target.value)}>
      {renderCatalog()}
    </Page>
  );
}
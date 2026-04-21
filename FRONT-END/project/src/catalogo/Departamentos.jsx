import ItemCard from "./CartaoDeItem.jsx";
import Header from "../Header.jsx";
import { useState, useEffect } from "react";
import config from "../config.jsx";
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
  const url = config.url + ":" + svc.port + svc.endpoints.catalog;
  const [data, setData] = useState(null);
  const [tag, setTag] = useState(null);
  const [search, setSearch] = useState("");
  // Hook para carregar o catálogo
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erro ao carregar catálogo:", err));
  }, []);
  // Mostra enquanto carrega os dados
  if (!data) {
    return (
      <Page search={search} onSearchChange={(e) => setSearch(e.target.value)}>
        <p>Carregando catálogo...</p>
      </Page>
    );
  }
  // Renderiza o catálogo
  const renderCatalog = () => {
    if (tag !== null) {
      const items = data.Itens?.[tag] || [];
      return (
        <>
          <button onClick={() => setTag(null)}>Voltar</button>
          {items.map((item, i) => (
            <div className="col" key={i}>
              <ItemCard img={item.imagem} itemName={item.nome} />
            </div>
          ))}
        </>
      );
    }
    // Filtra os departamentos
    const filtered = data.Categorias.filter((item) =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    );
    // Renderiza os departamentos
    return filtered.map((item, i) => (
      <div className="col" key={i}>
        <div onClick={() => setTag(item.tag)}>
          <ItemCard img={item.imagem} itemName={item.nome} />
        </div>
      </div>
    ));
  };
  // Retorna a página
  return (
    <Page search={search} onSearchChange={(e) => setSearch(e.target.value)}>
      {renderCatalog()}
    </Page>
  );
}
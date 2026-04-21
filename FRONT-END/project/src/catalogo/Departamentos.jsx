import ItemCard from "./CartaoDeItem.jsx";
import Header from "../Header.jsx";
import { useState, useEffect } from "react";
import config from "../config.jsx";

const Page = (props) => {
  return (
    <div className="container-fluid">
      <Header />

      <div className="header" style={{ padding: "3rem 1rem" }}>
        <h2 className="title-departamentos">CATEGORIAS DE PRODUTOS</h2>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          Explore especificações técnicas e detalhes por categoria
        </p>

        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoria"
          style={{
            borderRadius: "1.5rem",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        />
      </div>

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

export default function Departamentos() {
  const svc = config.services.catalog;

  const url =
    config.url +
    ":" +
    svc.port +
    svc.endpoints.catalog;

  const [data, setData] = useState(null);
  const [tag, setTag] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erro ao carregar catálogo:", err));
  }, []);

  if (!data) {
    return (
      <Page>
        <p>Carregando catálogo...</p>
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
              <ItemCard
                img={item.imagem}
                itemName={item.nome}
              />
            </div>
          ))}
        </>
      );
    }

    return data.Categorias.map((item, i) => (
      <div className="col" key={i}>
        <div onClick={() => setTag(item.tag)}>
          <ItemCard
            img={item.imagem}
            itemName={item.nome}
          />
        </div>
      </div>
    ));
  };

  return <Page>{renderCatalog()}</Page>;
}
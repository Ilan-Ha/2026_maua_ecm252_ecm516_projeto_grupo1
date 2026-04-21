import React, { useState, useEffect } from "react";
import Header from "../Header.jsx";
import ItemCard from "../catalogo/CartaoDeItem.jsx";

const Search = () => {
  const [data, setData] = useState({ Categorias: [], Itens: {} });

  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/catalogo")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const categorias = (data.Categorias || []).map((c) => c.tag);

  const categoriasFiltradas = categorias.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  );

  const renderCatalog = () => {
    const items = type
      ? data.Itens?.[type] || []
      : Object.values(data.Itens || {}).flat();

    if (!items.length) {
      return <p className="text-center">Nenhum produto encontrado</p>;
    }

    return items.map((item, i) => (
      <div className="col d-flex justify-content-center" key={i}>
        <ItemCard img={item.imagem} itemName={item.nome} />
      </div>
    ));
  };

  return (
    <div className="container-fluid">
      <Header />

      {/* CONTAINER CENTRAL */}
      <div className="d-flex flex-column align-items-center mt-4">

        {/* FILTRO */}
        <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
          <label className="mb-1">Categorias</label>

          <input
            type="text"
            className="form-control"
            placeholder="Digite uma categoria"
            value={search}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
          />

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                background: "#fff",
                border: "1px solid #ccc",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {categoriasFiltradas.map((c, i) => (
                <div
                  key={i}
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => {
                    setSearch(c);
                    setType(c);
                    setShowDropdown(false);
                  }}
                >
                  {c}
                </div>
              ))}

              {categoriasFiltradas.length === 0 && (
                <div style={{ padding: "8px", color: "gray" }}>
                  Nenhuma categoria encontrada
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GRID CENTRALIZADO */}
      <div className="container mt-4">
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 justify-content-center">
          {renderCatalog()}
        </div>
      </div>
    </div>
  );
};

export default Search;
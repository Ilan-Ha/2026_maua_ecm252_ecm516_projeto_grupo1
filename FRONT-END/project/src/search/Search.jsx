import React, { useState, useEffect } from "react";
import Header from "../Header";
import ItemCard from "../catalog/ItemCard.jsx";

const Search = () => {
  const [data, setData] = useState({ Categorias: [], Itens: {} });

  const [maxPrice, setMaxPrice] = useState(null);
  const [type, setType] = useState("");

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // FETCH DO BACKEND
  useEffect(() => {
    fetch("http://localhost:3000/catalogo")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // categorias reais do backend
  const categorias = data.Categorias.map((c) => c.tag);

  const categoriasFiltradas = categorias.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  );

  const renderCatalog = () => {
    if (!type) return <p>Filtre produtos</p>;

    let items = data.Itens[type] || [];

    if (items.length === 0) {
      return <p>Nenhum produto encontrado</p>;
    }

    if (maxPrice !== null) {
      items = items.filter((item) => (item.price ?? 0) <= maxPrice);
    }

    return (
      <>
        {items.map((item, i) => (
          <div className="col" key={i}>
            <ItemCard img={item.imagem} itemName={item.nome}>
              <p className="text-muted m-0">R$ {item.price}</p>
            </ItemCard>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container-fluid">
      <Header />

      <div>
        <div style={{ position: "relative", maxWidth: "300px" }}>
          <label>Categorias</label>

          <input
            type="text"
            className="form-control"
            value={search}
            placeholder="Digite uma categoria"
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
                background: "white",
                border: "1px solid #ccc",
                zIndex: 10,
              }}
            >
              {categoriasFiltradas.map((c, i) => (
                <div
                  key={i}
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => {
                    setSelected(c);
                    setSearch(c);
                    setShowDropdown(false);
                    setType(c);
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

        <input
          type="number"
          min={0}
          placeholder="Preço máximo"
          className="form-control"
          value={maxPrice ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setMaxPrice(value === "" ? null : Math.max(0, Number(value)));
          }}
        />
      </div>

      <div className="col">
        <div className="bottom">
          <div className="container-fluid">
            <div className="row row-cols-2 row-cols-lg-4 g-2">
              {renderCatalog()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
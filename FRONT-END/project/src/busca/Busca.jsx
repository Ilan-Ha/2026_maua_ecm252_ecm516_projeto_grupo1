import React from "react";
import Header from "../Header.jsx";

const Search = () => {
  return (
    <div className="container-fluid">
      <Header />
      <div className="container mt-4 mb-5 text-center">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#377f3f" }}>
          Busca de Produtos
        </h2>
        <p className="text-muted">A funcionalidade de busca geral será implementada em breve. Por favor, utilize o catálogo ou a página de comparação de produtos.</p>
      </div>
    </div>
  );
};

export default Search;
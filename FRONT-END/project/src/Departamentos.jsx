import React from "react";
import ItemCard from "./ItemCard.jsx";

export default function Departamentos() {
  const height = "8.50rem";
  
  return (
    <div className="container-fluid">
      <div className="header" style={{ padding: "3rem 1rem" }}>
        <h2
          style={{
            fontFamily: "Calibri",
            fontWeight: "bold",
            marginBottom: ".25rem",
          }}
        >
          CATEGORIAS DE PRODUTOS
        </h2>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          Explore especificações técnicas e detalhes por categoria
        </p>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoria"
          style={{ borderRadius: "1.5rem", height: "60%", margin: "0 auto" }}
        />
      </div>
      <div className="categories">
        <div className="container">
          <div className="row">
            <div className="col d-flex justify-content-center">
              <ItemCard
                cardHeight={height}
                itemName="Celular"
                img="celular.png"
              ></ItemCard>
            </div>
            <div className="col d-flex justify-content-center">
              <ItemCard
                cardHeight={height}
                itemName="Placas de Vídeo"
                img="placa-grafica.png"
              ></ItemCard>
            </div>
            <div className="col d-flex justify-content-center">
              <ItemCard
                cardHeight={height}
                itemName="Geladeira"
                img="geladeira.png"
              ></ItemCard>
            </div>
            <div className="col d-flex justify-content-center">
              <ItemCard
                cardHeight={height}
                itemName="Air Fryers"
                img="fritadeira-de-ar.png"
              ></ItemCard>
            </div>
            <div className="col d-flex justify-content-center">
              <ItemCard
                cardHeight={height}
                itemName="Microondas"
                img="microondas.png"
              ></ItemCard>
            </div>
            <div className="col d-flex justify-content-center">
              <ItemCard
                cardHeight={height}
                itemName="Videogames"
                img="consola-de-video.png"
              ></ItemCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

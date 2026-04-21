import React from "react";
import { Link } from "react-router-dom";
// Componente de Cartão de Item
const ItemCard = (props) => {
  return (
    <Link to={props.itemLink ?? "#"} className="text-decoration-none">
      {/* Container do Cartão */}
      <div
        className="card h-100 shadow-sm hover rounded-4"
        style={{
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
        }}
      >
        {/* Container de Imagem */}
        <div
          className="card-image-container d-flex"
          style={{
            aspectRatio: "1/1",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Imagem do produto */}
          <img
            className="card-img-top"
            src={props.img || "https://placehold.co/400"}
            alt={props.itemName}
            style={{
              objectFit: "cover",
              padding: "0.75rem",
            }}
          />
        </div>
        {/* Container de Texto */}
        <div className="card-body d-flex flex-column text-center rounded-bottom-4 custom-body item-card">
          {/* Título do produto */}
          <h2 className="card-title custom-title m-auto item-card-title">
            {props.itemName}
          </h2>
          {/* Props */}
          {props.children}
        </div>
      </div>
    </Link>
  );
};
export default ItemCard;
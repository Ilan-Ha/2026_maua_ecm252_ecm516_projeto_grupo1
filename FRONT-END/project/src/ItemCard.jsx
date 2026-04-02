import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

//  PROPS
//  img = "./exemplo.smp "            -- diretorio da imagem (public não precisa ser ./public/img.png, apenas ./img.png)
//  itemName = "titulo de exemplo"    -- titulo do card   
//  itemLink = "/exemplo"             -- pagina que o card leva ao ser clicado  (deve ter / no início)

const ItemCard = (props) => {

  return (
    <Link to={props.itemLink} className="text-decoration-none">
      <div
        className="card h-100 shadow-sm hover rounded-4"
        style={{
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
        }}
      >
        <div
          className="card-image-container d-flex"
          style={{
            aspectRatio: "1/1",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            className="card-img-top"
            src={props.img}
            alt={props.itemName}
            style={{
              objectFit: "cover",
              padding: "0.75rem",
            }}
          />
        </div>
        <div className="card-body d-flex flex-column text-center rounded-bottom-4 custom-body item-card ">
          <h2 className="card-title custom-title m-auto item-card-title">
            {props.itemName}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;

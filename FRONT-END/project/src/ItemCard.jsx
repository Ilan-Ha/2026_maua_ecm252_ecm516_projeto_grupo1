import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

//  PROPS
//  img = src da imagem
//  itemName = titulo do card
//  onClick = pagina que o card leva ao ser clicado

const ItemCard = (props) => {
  return (
    <div className="card h-100 shadow-sm hover rounded-4" style={{
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer"
    }}
    >
      <img 
        className="card-img-top"  
        src={props.img} 
        alt={props.itemName}
        style={{
          objectFit: "cover",
          padding: "0.75rem"
        }}
      />
      <div className="card-body d-flex flex-column text-center rounded-bottom-4 custom-body item-card ">
        <h2 className="card-title custom-title m-auto item-card-title">{props.itemName}</h2>
      </div>
    </div>
  );
};

export default ItemCard;

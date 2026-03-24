import React from "react";
import Cadastro from "./Cadastro";

//

const ItemCard = (props) => {
  return (
    <div
      className="card"
      style={{
        width: "14rem",
        padding: "0px",
        borderRadius: "1.5rem",
      }}
      onClick={props.onClick}
    >
      <div className="img-body">
        <img
          class="card-img-top"
          src={props.img}
          alt="Card image cap"
          style={{
            maxHeight: "14rem",
            objectFit: "cover",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
        ></img>
        <div
          style={{
            position: "absolute",
            bottom: "6rem",
            left: 0,
            width: "100%",
            height: "50%",
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255) 100%)",

          }}
        />
      </div>
      <div
        className="card-body"
        style={{
          height: "6rem",
          padding: "0px",
          textAlign: "left",
        }}
      >
        <h2
          style={{
            textAlign: "left",
            padding: "0.25rem 0px 0px 1rem",
            fontFamily: "Calibri",
            fontWeight: "Bold",
          }}
        >
          {props.itemName}
        </h2>
        <button
          className="btn btn-success"
          style={{
            marginLeft: "1rem",
            borderRadius: "2rem",
            backgroundColor: "#e8f6e4",
            borderColor: "#e8f6e4",
            color: "#377f3f",
            fontWeight: 700,
          }}
        >
          Ver produtos ⇒
        </button>
      </div>
    </div>
  );
};

export default ItemCard;

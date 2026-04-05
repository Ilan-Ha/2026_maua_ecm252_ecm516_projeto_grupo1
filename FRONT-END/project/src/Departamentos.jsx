
import ItemCard from "./ItemCard.jsx";
import Cadastro from "./Cadastro.jsx";
import Header from "./Header.jsx";
import { BrowserRouter } from "react-router";
import { useState } from "react";
import data from './tempData.json'


export default function Departamentos() {
  const [tag,setTag] = useState(null)

const renderCatalog = () => {
  if (tag !== null) {
    return (
      <>
        <button onClick={() => setTag(null)}>Voltar</button>
        {data.Itens[tag].map((item, i) => (
          <div className="col" key={i}>
            <ItemCard img={item.imag} itemName={item.name} />
          </div>
        ))}
      </>
    )
  }

  return data.Categorias.map((item, i) => (
    <div className="col" key={i}>
      <div
        className="item-card"
        onClick={() => setTag(item.tag)}
      >
        <ItemCard img={item.imag} itemName={item.name} />
      </div>
    </div>
  ))
}
  return (
    <div className="container-fluid"> 
      <Header></Header>
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
            height: "60%",
            margin: "0 auto",
            maxWidth: "800px",
          }}
        />
      </div>
      <div className="bottom">
        <div className="container-fluid">
          <div className="row row-cols-2 row-cols-lg-4 g-2">
            {renderCatalog()}
          </div>
        </div>
      </div>
    </div>


  );
}

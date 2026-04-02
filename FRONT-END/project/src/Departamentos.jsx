
import ItemCard from "./ItemCard.jsx";
import Cadastro from "./Cadastro.jsx";
import Header from "./Header.jsx";
import { BrowserRouter } from "react-router";


export default function Departamentos() {
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
            <div className="col">
              <div className="item-card">
                <ItemCard
                  img="./celulares.webp"
                  itemName="Celulares"
                  itemLink="/cadastro"
                ></ItemCard>
              </div>
            </div>
            <div className="col">
              <div className="item-card">
                <ItemCard
                  img="./gpu.jpg"
                  itemName="Placas de Vídeo"
                  itemLink="/login"
                ></ItemCard>
              </div>
            </div>
            <div className="col">
              <div className="item-card">
                <ItemCard
                  img="./geladeira.webp"
                  itemName="Geladeiras"
                  itemLink="/cadastro"
                ></ItemCard>
              </div>
            </div>
            <div className="col">
              <div className="item-card">
                <ItemCard
                  img="./bike.webp"
                  itemName="Bicicletas"
                  itemLink="/login"
                ></ItemCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

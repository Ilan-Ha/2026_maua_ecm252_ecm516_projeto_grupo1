import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Header.jsx";
import config from "../config.jsx";

const Search = () => {
  const svc = config.services.catalog;
  const baseUrl = config.url + ":" + svc.port;

  // Estado do Catálogo
  const [data, setData] = useState({ Categorias: [], Itens: {} });

  // Categoria selecionada
  const [categoriaSel, setCategoriaSel] = useState("");
  
  // IDs selecionados em cada coluna (inicia com 2 colunas vazias)
  const [colunas, setColunas] = useState(["", ""]);

  // Cache dos produtos detalhados { "id1": { ... }, "id2": { ... } }
  const [detalhes, setDetalhes] = useState({});

  // Carrega catálogo inicial
  useEffect(() => {
    fetch(`${baseUrl}/catalogo`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error);
  }, [baseUrl]);

  // Ao mudar de categoria, limpa as colunas e os detalhes
  useEffect(() => {
    setColunas(["", ""]);
    setDetalhes({});
  }, [categoriaSel]);

  // Busca detalhes para qualquer novo ID selecionado
  useEffect(() => {
    colunas.forEach((id) => {
      if (id && !detalhes[id]) {
        fetch(`${baseUrl}/produto/${id}`)
          .then((res) => res.json())
          .then((prod) => {
            setDetalhes((prev) => ({ ...prev, [id]: prod }));
          })
          .catch(console.error);
      }
    });
  }, [colunas, baseUrl, detalhes]);

  // Funções de manipulação das colunas
  const atualizaColuna = (index, novoId) => {
    const novasColunas = [...colunas];
    novasColunas[index] = novoId;
    setColunas(novasColunas);
  };

  const adicionarColuna = () => {
    setColunas([...colunas, ""]);
  };

  const removerColuna = (index) => {
    const novasColunas = [...colunas];
    novasColunas.splice(index, 1);
    setColunas(novasColunas);
  };

  // Funções auxiliares
  const getTodasEspecificacoes = () => {
    const todasChaves = new Set();
    colunas.forEach((id) => {
      const prod = detalhes[id];
      if (prod && prod.especificacoes) {
        Object.keys(prod.especificacoes).forEach((k) => todasChaves.add(k));
      }
    });
    return Array.from(todasChaves).sort();
  };

  const formataValor = (valor) => {
    if (typeof valor === "boolean") return valor ? "✔ Sim" : "✘ Não";
    if (valor === undefined || valor === null) return "-";
    return String(valor);
  };

  const formataMoeda = (valor) => {
    if (!valor) return "-";
    return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const chavesSpecs = getTodasEspecificacoes();
  const listaProdutos = categoriaSel ? data.Itens[categoriaSel] || [] : [];
  
  // Calcula menor preço para destacar
  const precosValidos = colunas
    .map(id => detalhes[id]?.precoMedio)
    .filter(p => p > 0);
  const menorPreco = precosValidos.length > 0 ? Math.min(...precosValidos) : null;

  const temAlgumProdutoSelecionado = colunas.some((id) => id !== "");

  return (
    <div className="container-fluid">
      <Header />

      <div className="container mt-4 mb-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#377f3f" }}>
          Comparação de Produtos
        </h2>

        {/* CONTROLES DE SELEÇÃO */}
        <div className="card shadow-sm p-4 mb-4 rounded-4">
          <div className="mb-4 d-flex flex-column align-items-center">
            <label className="form-label fw-bold text-center">1. Escolha a Categoria</label>
            <select
              className="form-select w-100"
              value={categoriaSel}
              onChange={(e) => setCategoriaSel(e.target.value)}
              style={{ maxWidth: "300px" }}
            >
              <option value="">Selecione...</option>
              {data.Categorias.map((cat, i) => (
                <option key={i} value={cat.tag}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {categoriaSel && (
            <div>
              <label className="form-label fw-bold d-block mb-3">2. Selecione os produtos para comparar:</label>
              <div className="d-flex flex-wrap gap-3 align-items-end">
                {colunas.map((idSelecionado, index) => (
                  <div key={index} className="d-flex flex-column" style={{ minWidth: "220px", flex: 1 }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small fw-bold">Produto {index + 1}</span>
                      {colunas.length > 2 && (
                        <button 
                          className="btn btn-sm text-danger p-0 border-0 bg-transparent"
                          onClick={() => removerColuna(index)}
                          title="Remover coluna"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <select
                      className="form-select"
                      value={idSelecionado}
                      onChange={(e) => atualizaColuna(index, e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {listaProdutos.map((prod, i) => (
                        <option 
                          key={i} 
                          value={prod._id} 
                          // Desabilita se já estiver selecionado em OUTRA coluna
                          disabled={colunas.includes(prod._id) && prod._id !== idSelecionado}
                        >
                          {prod.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                
                {/* Botão de adicionar mais colunas */}
                {colunas.length < listaProdutos.length && (
                  <button 
                    className="btn btn-outline-success" 
                    onClick={adicionarColuna}
                    style={{ height: "38px" }}
                  >
                    + Produto
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TABELA DE COMPARAÇÃO */}
        {temAlgumProdutoSelecionado && (
          <div className="card shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle mb-0" style={{ tableLayout: "fixed", minWidth: `${200 + (colunas.length * 250)}px` }}>
                <thead style={{ backgroundColor: "#e8f6e4" }}>
                  <tr>
                    <th style={{ width: "200px", verticalAlign: "middle" }}>Recurso</th>
                    
                    {colunas.map((id, index) => {
                      const prod = detalhes[id];
                      return (
                        <th key={index} style={{ width: "250px" }}>
                          {prod ? (
                            <div className="d-flex flex-column align-items-center">
                              <img
                                src={prod.imagem}
                                alt={prod.nome}
                                style={{ height: "150px", objectFit: "contain", marginBottom: "10px" }}
                              />
                              <h5 className="fw-bold m-0 fs-6">{prod.nome}</h5>
                              <Link to={`/produto/${prod._id}`} className="btn btn-sm btn-outline-success mt-2">
                                Ver detalhes
                              </Link>
                            </div>
                          ) : (
                            <span className="text-muted">Nenhum selecionado</span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* INFORMAÇÕES BÁSICAS */}
                  <tr>
                    <td className="fw-bold text-start ps-4 bg-light">Marca</td>
                    {colunas.map((id, index) => (
                      <td key={index}>{detalhes[id] ? detalhes[id].marca || "-" : "-"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="fw-bold text-start ps-4 bg-light">Lançamento</td>
                    {colunas.map((id, index) => (
                      <td key={index}>{detalhes[id] ? detalhes[id].lancamento || "-" : "-"}</td>
                    ))}
                  </tr>
                  
                  {/* PREÇO MÉDIO */}
                  <tr>
                    <td className="fw-bold text-start ps-4 bg-light">Preço Médio</td>
                    {colunas.map((id, index) => {
                      const prod = detalhes[id];
                      const ehMaisBarato = prod && menorPreco && prod.precoMedio === menorPreco;
                      return (
                        <td key={index} className={ehMaisBarato ? "text-success fw-bold bg-success bg-opacity-10" : ""}>
                          {prod ? formataMoeda(prod.precoMedio) : "-"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* ESPECIFICAÇÕES DINÂMICAS */}
                  {chavesSpecs.length > 0 && (
                    <tr>
                      <td colSpan={colunas.length + 1} className="fw-bold text-center bg-secondary text-white">
                        ESPECIFICAÇÕES TÉCNICAS
                      </td>
                    </tr>
                  )}
                  {chavesSpecs.map((chave) => (
                    <tr key={chave}>
                      <td className="fw-bold text-start ps-4 bg-light text-capitalize">
                        {chave.replace(/([A-Z])/g, " $1").trim()}
                      </td>
                      {colunas.map((id, index) => (
                        <td key={index}>
                          {detalhes[id] ? formataValor(detalhes[id].especificacoes?.[chave]) : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
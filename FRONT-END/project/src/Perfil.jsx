import { useState } from "react";
import config from "./config";

const svc = config.services.user;

export default function Perfil({ usuario, setUsuario }) {
  // Hook de estado para armazenar dados do formulário
  const [form, setForm] = useState({
    email: usuario?.email || "",
    nome: usuario?.nome || "",
    senha: ""
  });
  // Proteção caso usuario seja null (depois dos hooks!)
  if (!usuario) return <p>Nenhum usuário logado.</p>;
  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  // Função para lidar com a atualização do perfil
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Envia dados para o backend
    try {
      const res = await fetch(`http://localhost:${svc.port}${svc.endpoints.changeInformation}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      // Converte a resposta para JSON
      const data = await res.json();
      alert(data.message);
      // Atualiza o usuario global e o form local
      if (data.usuario) {
        setUsuario(data.usuario);
        setForm({ ...form, nome: data.usuario.nome, email: data.usuario.email, senha: "" });
      }
    // Em caso de erro
    } catch {
      alert("Erro ao atualizar");
    }
  };
  // Retorno do componente
  return (
    <div>
      {/* Cabeçalho */}
      <h2>Perfil</h2>
      {/* Formulário de perfil */}
      <form onSubmit={handleUpdate}>
        {/* Campo de email */}
        <input
          className="form-control mb-3"
          type="email"
          value={form.email}
          disabled
        />
        {/* Campo de nome */}
        <input
          className="form-control mb-3"
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        {/* Campo de senha */}
        <input
          className="form-control mb-3"
          type="password"
          name="senha"
          placeholder="Nova senha"
          onChange={handleChange}
          required
        />
        {/* Botão de envio */}
        <button className="btn btn-primary" type="submit">Atualizar</button>
      </form>
    </div>
  );
}
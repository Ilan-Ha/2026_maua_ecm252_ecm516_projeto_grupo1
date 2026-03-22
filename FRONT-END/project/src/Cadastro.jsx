import { useState } from "react";
export default function Cadastro() {
  // Hook de estado para armazenar dados do formulário/
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: ""
  });
  // Função para lidar com mudanças no formulário/
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  // Função para lidar com o envio do formulário/
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Envia dados para o backend/
    try {
      const res = await fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      // Verifica se a resposta foi bem sucedida/
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Erro no servidor");
        return;
      }
      // Converte a resposta para JSON/
      const data = await res.json();
      alert(data.message);
      // Limpa o formulário/
      setForm({
        nome: "",
        email: "",
        senha: ""
      });
    // Em caso de erro/
    } catch (err) {
      alert("Erro ao conectar com o servidor");
    }
  };
  return (
    <div>
      {/* Cabeçalho */}
      <h2>Cadastro</h2>
      {/* Formulário de cadastro */}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        {/* Campo de email */}
        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {/* Campo de senha */}
        <input
          className="form-control mb-3"
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        {/* Botão de envio */}
        <button className="btn btn-success" type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
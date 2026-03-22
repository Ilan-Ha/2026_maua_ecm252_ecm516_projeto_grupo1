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
        throw new Error("Erro no servidor");
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
      alert("Erro ao cadastrar");
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
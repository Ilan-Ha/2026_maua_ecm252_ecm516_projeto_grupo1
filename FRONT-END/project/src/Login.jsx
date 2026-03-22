import { useState } from "react";

export default function Login() {
  // Hook de estado para armazenar dados do formulário/
  const [form, setForm] = useState({
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
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      // Verifica se a resposta foi bem sucedida/
      if (!res.ok) {
        throw new Error("Erro no login");
      }
      // Converte a resposta para JSON/
      const data = await res.json();
      alert(data.message);
      // Limpa o formulário/
      setForm({
        email: "",
        senha: ""
      });
    // Em caso de erro/
    } catch (err) {
      alert("Email ou senha inválidos");
    }
  };
  // Retorno do componente/
  return (
    <div>
      <h2>Login</h2>
      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        {/* Campo de senha */}
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <br />
        {/* Botão de envio */}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
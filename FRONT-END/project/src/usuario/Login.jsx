import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
export default function Login({ setUsuario}) {
  const svc = config.services.auth
  const url = config.url +":" + String(svc.port) + String(svc.endpoints.login)
  const navigate = useNavigate()
  // Hook de estado para armazenar dados do formulário
  const [form, setForm] = useState({
    email: "",
    senha: ""
  });
  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Envia dados para o backend
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      // Verifica se a resposta foi bem sucedida
      if (!res.ok) {
        throw new Error("Erro no login");
      }
      // Converte a resposta para JSON
      const data = await res.json();
      console.log("Resposta do backend:", data);
      console.log("Usuario recebido:", data.usuario);
      // login OK → salva usuário
      setUsuario(data.usuario);
      // muda para perfil
      navigate("/perfil");
    // Em caso de erro
    } catch (err) {
      alert("Email ou senha inválidos");
    }
  };
  // Retorno do componente
  return (
    <div>
      <h2>Login</h2>
      {/* Formulário de login */}
      <form onSubmit={handleSubmit}>
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
        <button className="btn btn-primary" type="submit">Entrar</button>
      </form>
    </div>
  );
}
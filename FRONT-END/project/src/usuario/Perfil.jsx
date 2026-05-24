import { useState } from "react";
import config from "../config";
import Header from "../Header.jsx";

export default function Perfil({ usuario, setUsuario }) {
  const svc = config.services.user;
  const url = config.url + ":" + String(svc.port) + String(svc.endpoints.perfil);
  // Hook de estado para armazenar dados do formulário
  const [form, setForm] = useState({
    email: usuario?.email || "",
    nome: usuario?.nome || "",
    senha: ""
  });
  // Proteção caso usuario seja null (depois dos hooks!)
  if (!usuario) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="text-center mt-5">
          <h3>Nenhum usuário logado</h3>
          <p className="text-muted">Por favor, realize o login para acessar esta página.</p>
        </div>
      </div>
    );
  }
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
      const res = await fetch(url, {
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
    <div className="container-fluid">
      <Header />
      <div className="auth-page perfil-page">
        <div className="auth-card perfil-card" style={{ maxWidth: "450px" }}>
          <h2 className="auth-title">Perfil</h2>
          <p className="auth-subtitle text-muted">
            Atualize seus dados de cadastro na plataforma.
          </p>

          <form onSubmit={handleUpdate} className="auth-form">
            {/* Campo de email */}
            <div className="mb-3 text-start">
              <label className="form-label auth-label">Email (Não alterável)</label>
              <input
                className="form-control auth-input"
                type="email"
                value={form.email}
                disabled
                style={{ backgroundColor: "#e2e8f0", cursor: "not-allowed" }}
              />
            </div>

            {/* Campo de nome */}
            <div className="mb-3 text-start">
              <label className="form-label auth-label">Nome Completo</label>
              <input
                className="form-control auth-input"
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo de senha */}
            <div className="mb-4 text-start">
              <label className="form-label auth-label">Nova Senha</label>
              <input
                className="form-control auth-input"
                type="password"
                name="senha"
                placeholder="Digite a nova senha para atualizar"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            {/* Botão de envio */}
            <button className="auth-submit" type="submit">
              Atualizar Perfil
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
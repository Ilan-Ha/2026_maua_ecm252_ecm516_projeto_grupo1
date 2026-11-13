import { useState } from "react";
import Header from "../Header.jsx";
import { Link } from "react-router-dom";
import config, { apiBase } from "../config";

export default function Cadastro() {
  const svc = config.services.auth;
  const url = apiBase + svc.endpoints.register;

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (mensagem.texto) setMensagem({ tipo: "", texto: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg =
          typeof errorData.message === "string"
            ? errorData.message
            : "Erro no servidor";
        setMensagem({ tipo: "danger", texto: msg });
        return;
      }

      const data = await res.json();
      setMensagem({ tipo: "success", texto: data.message });
      setForm({ nome: "", email: "", senha: "", confirmarSenha: "" });
    } catch {
      setMensagem({
        tipo: "danger",
        texto: "Erro ao conectar com o servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="auth-page cadastro-page">
        <div className="auth-card cadastro-card">
          <h2 className="auth-title">Criar conta</h2>
          <p className="auth-subtitle text-muted">
            Cadastre-se para acessar seu perfil e comparar produtos.
          </p>

          {mensagem.texto && (
            <div
              className={`alert alert-${mensagem.tipo} auth-alert`}
              role="alert"
            >
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="mb-3 text-start">
              <label htmlFor="nome" className="form-label auth-label">
                Nome
              </label>
              <input
                id="nome"
                className="form-control auth-input"
                type="text"
                name="nome"
                placeholder="Seu nome"
                value={form.nome}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="email" className="form-label auth-label">
                Email
              </label>
              <input
                id="email"
                className="form-control auth-input"
                type="email"
                name="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="senha" className="form-label auth-label">
                Senha
              </label>
              <input
                id="senha"
                className="form-control auth-input"
                type="password"
                name="senha"
                placeholder="Mín. 8 chars, maiúscula, número e especial"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="mb-4 text-start">
              <label htmlFor="confirmarSenha" className="form-label auth-label">
                Confirmar senha
              </label>
              <input
                id="confirmarSenha"
                className="form-control auth-input"
                type="password"
                name="confirmarSenha"
                placeholder="Repita a senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="auth-footer">
            Já tem conta?{" "}
            <Link to={svc.endpoints.login} className="auth-link">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

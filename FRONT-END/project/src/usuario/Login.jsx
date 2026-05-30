import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Header.jsx";
import config, { apiBase } from "../config";

export default function Login({ setUsuario }) {
  const svc = config.services.auth;
  const perfilPath = config.services.user.endpoints.perfil;
  const url = apiBase + svc.endpoints.login;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: "",
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
        setMensagem({
          tipo: "danger",
          texto: errorData.message || "Email ou senha inválidos",
        });
        return;
      }

      const data = await res.json();
      const usuario = data.usuario || data.content?.usuario;
      if (!usuario) {
        setMensagem({ tipo: "danger", texto: "Resposta inválida do servidor" });
        return;
      }
      setUsuario(usuario);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate(perfilPath);
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
      <div className="auth-page login-page">
        <div className="auth-card login-card">
          <h2 className="auth-title">Entrar</h2>
          <p className="auth-subtitle text-muted">
            Acesse sua conta para ver seu perfil e comparar produtos.
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
              <label htmlFor="login-email" className="form-label auth-label">
                Email
              </label>
              <input
                id="login-email"
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

            <div className="mb-4 text-start">
              <label htmlFor="login-senha" className="form-label auth-label">
                Senha
              </label>
              <input
                id="login-senha"
                className="form-control auth-input"
                type="password"
                name="senha"
                placeholder="Sua senha"
                value={form.senha}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta?{" "}
            <Link to={svc.endpoints.register} className="auth-link">
              Cadastrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

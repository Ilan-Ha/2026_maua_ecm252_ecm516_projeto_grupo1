import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header.jsx";
import config from "../config";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiFetch } from "../auth/api.js";
import { saveSession } from "../auth/session.js";

export default function Perfil() {
  const svc = config.services.user;
  const loginPath = config.services.auth.endpoints.login;
  const url = svc.endpoints.perfil;
  const navigate = useNavigate();
  const { usuario, logout, loginSession } = useAuth();

  const [form, setForm] = useState({
    email: usuario?.email || "",
    nome: usuario?.nome || "",
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

  const handleLogout = async () => {
    await logout();
    navigate(loginPath);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    if (form.senha || form.confirmarSenha) {
      if (form.senha !== form.confirmarSenha) {
        setMensagem({ tipo: "danger", texto: "As senhas não coincidem" });
        setLoading(false);
        return;
      }
      if (form.senha.length < 8) {
        setMensagem({
          tipo: "danger",
          texto: "A senha deve ter no mínimo 8 caracteres",
        });
        setLoading(false);
        return;
      }
    }

    const payload = {
      email: form.email,
      nome: form.nome,
    };
    if (form.senha) payload.senha = form.senha;

    try {
      const res = await apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          typeof data.message === "string"
            ? data.message
            : "Erro ao atualizar perfil";
        setMensagem({ tipo: "danger", texto: msg });
        return;
      }

      setMensagem({
        tipo: "success",
        texto: data.message || "Dados atualizados",
      });

      if (data.usuario) {
        loginSession({
          usuario: data.usuario,
          accessToken: undefined,
          refreshToken: undefined,
        });
        // preserve tokens: saveSession only updates provided fields
        saveSession({ usuario: data.usuario });
        setForm({
          email: data.usuario.email,
          nome: data.usuario.nome,
          senha: "",
          confirmarSenha: "",
        });
      } else {
        setForm({ ...form, senha: "", confirmarSenha: "" });
      }
    } catch {
      setMensagem({
        tipo: "danger",
        texto: "Erro ao conectar com o servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="container-fluid">
        <Header />
        <div className="auth-page perfil-page">
          <div className="auth-card perfil-card">
            <h2 className="auth-title">Meu perfil</h2>
            <p className="auth-subtitle text-muted">
              Faça login para acessar e editar seus dados.
            </p>
            <Link to={loginPath} className="auth-submit d-block text-center text-decoration-none">
              Ir para login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header />
      <div className="auth-page perfil-page">
        <div className="auth-card perfil-card">
          <h2 className="auth-title">Meu perfil</h2>
          <p className="auth-subtitle text-muted">
            Atualize seus dados ou altere a senha.
          </p>

          {mensagem.texto && (
            <div className={`alert alert-${mensagem.tipo} auth-alert`} role="alert">
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleUpdate} className="auth-form">
            <div className="mb-3 text-start">
              <label className="form-label auth-label">Email</label>
              <input
                className="form-control auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label auth-label">Nome</label>
              <input
                className="form-control auth-input"
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label className="form-label auth-label">Nova senha</label>
              <input
                className="form-control auth-input"
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className="mb-4 text-start">
              <label className="form-label auth-label">Confirmar senha</label>
              <input
                className="form-control auth-input"
                type="password"
                name="confirmarSenha"
                value={form.confirmarSenha}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </form>

          <button
            type="button"
            className="btn btn-outline-danger w-100 mt-3"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

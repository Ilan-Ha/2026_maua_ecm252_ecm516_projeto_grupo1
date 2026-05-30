import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header.jsx";
import config, { apiBase } from "../config";

export default function Perfil({ usuario, setUsuario }) {
  const svc = config.services.user;
  const loginPath = config.services.auth.endpoints.login;
  const url = apiBase + svc.endpoints.perfil;
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
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
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
        setUsuario(data.usuario);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
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
            Atualize seu nome ou altere sua senha de acesso.
          </p>

          {mensagem.texto && (
            <div
              className={`alert alert-${mensagem.tipo} auth-alert`}
              role="alert"
            >
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleUpdate} className="auth-form">
            <div className="mb-3 text-start">
              <label htmlFor="perfil-email" className="form-label auth-label">
                Email
              </label>
              <input
                id="perfil-email"
                className="form-control auth-input"
                type="email"
                name="email"
                value={form.email}
                disabled
                autoComplete="email"
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="perfil-nome" className="form-label auth-label">
                Nome
              </label>
              <input
                id="perfil-nome"
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
              <label htmlFor="perfil-senha" className="form-label auth-label">
                Nova senha
              </label>
              <input
                id="perfil-senha"
                className="form-control auth-input"
                type="password"
                name="senha"
                placeholder="Deixe em branco para manter a atual"
                value={form.senha}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="mb-4 text-start">
              <label
                htmlFor="perfil-confirmarSenha"
                className="form-label auth-label"
              >
                Confirmar nova senha
              </label>
              <input
                id="perfil-confirmarSenha"
                className="form-control auth-input"
                type="password"
                name="confirmarSenha"
                placeholder="Repita a nova senha"
                value={form.confirmarSenha}
                onChange={handleChange}
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>

          <p className="auth-footer">
            <Link to={config.start} className="auth-link">
              Voltar ao catálogo
            </Link>
            {" · "}
            <button
              type="button"
              className="btn btn-link auth-link p-0 align-baseline border-0"
              onClick={handleLogout}
            >
              Sair
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

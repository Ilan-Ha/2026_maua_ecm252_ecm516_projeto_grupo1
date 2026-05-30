import express from "express";
import cors from "cors";
import axios from "axios";
import config from "../utlis/config.js";

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.gateway;
const base = config.url;

const app = express();
app.use(cors());
app.use(express.json());

function formatMessage(message) {
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return Object.values(message)
      .flat()
      .filter(Boolean)
      .join(". ");
  }
  return "Erro no servidor";
}

async function proxyGet(targetBase, req, res) {
  try {
    const url = `${targetBase}${req.originalUrl}`;
    const response = await axios.get(url, { validateStatus: () => true });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("[gateway] Erro no proxy GET:", err.message);
    res.status(502).json({ error: "Serviço indisponível", target: targetBase });
  }
}

async function callAuth(path, payload) {
  const response = await axios.post(`${base}:${svc.auth}${path}`, { payload });
  return response.data;
}

const funcoesRequest = {
  [paths.auth.register]: (payload) =>
    axios.post(`${base}:${svc.auth}${paths.auth.register}`, { payload }),
  [paths.auth.login]: (payload) =>
    axios.post(`${base}:${svc.auth}${paths.auth.login}`, { payload }),
  [paths.auth.update.password]: (payload) =>
    axios.post(`${base}:${svc.auth}${paths.auth.update.password}`, { payload }),
};

app.get("/health", async (req, res) => {
  const checks = await Promise.allSettled([
    axios.get(`${base}:${svc.catalog}/health`, { timeout: 3000 }),
    axios.get(`${base}:${svc.auth}/health`, { timeout: 3000 }).catch(() => null),
    axios.get(`${base}:${svc.user}/health`, { timeout: 3000 }).catch(() => null),
  ]);

  const catalogOk =
    checks[0].status === "fulfilled" && checks[0].value?.data?.backend === true;
  const catalogDb =
    checks[0].status === "fulfilled" && checks[0].value?.data?.db === true;

  res.json({
    backend: true,
    catalog: catalogOk,
    db: catalogDb,
    status: catalogOk && catalogDb ? "ok" : "degraded",
  });
});

app.get("/health/db", async (req, res) => {
  try {
    const response = await axios.get(`${base}:${svc.catalog}/health/db`, {
      timeout: 3000,
    });
    res.json({
      db: response.data?.db === true,
      status: response.data?.db ? "ok" : "error",
    });
  } catch {
    res.json({ db: false, status: "error" });
  }
});

app.get(paths.catalog.catalog, (req, res) =>
  proxyGet(`${base}:${svc.catalog}`, req, res)
);

app.get("/produto/:id", (req, res) =>
  proxyGet(`${base}:${svc.catalog}`, req, res)
);

app.post(paths.auth.register, async (req, res) => {
  try {
    const { nome, email, senha, confirmarSenha } = req.body;
    const data = await callAuth(paths.auth.register, {
      nome,
      email,
      senha,
      confirmarSenha: confirmarSenha || senha,
    });

    if (data.error) {
      return res
        .status(data.status || 400)
        .json({ message: formatMessage(data.message) });
    }

    return res
      .status(data.status || 201)
      .json({ message: data.message || "Usuário cadastrado" });
  } catch (err) {
    console.error("[gateway] Erro no cadastro:", err.message);
    res.status(500).json({ message: "Erro ao conectar com o servidor" });
  }
});

app.post(paths.auth.login, async (req, res) => {
  try {
    const { email, senha } = req.body;
    const data = await callAuth(paths.auth.login, { email, senha });

    if (data.error) {
      return res
        .status(data.status || 401)
        .json({ message: formatMessage(data.message) });
    }

    const usuario = data.content?.usuario || data.usuario;
    return res.json({
      message: data.message || "Login OK",
      usuario,
    });
  } catch (err) {
    console.error("[gateway] Erro no login:", err.message);
    res.status(500).json({ message: "Erro ao conectar com o servidor" });
  }
});

app.put(paths.user.perfil, async (req, res) => {
  try {
    const { email, nome, senha } = req.body;

    if (senha) {
      const data = await callAuth(paths.auth.update.password, {
        email,
        senha,
        confirmarSenha: senha,
      });

      if (data.error) {
        return res
          .status(data.status || 400)
          .json({ message: formatMessage(data.message) });
      }
    }

    return res.json({
      message: "Dados atualizados",
      usuario: { email, nome },
    });
  } catch (err) {
    console.error("[gateway] Erro no perfil:", err.message);
    res.status(500).json({ message: "Erro ao atualizar" });
  }
});

app.post(paths.gateway.request, async (req, res) => {
  try {
    const { request, payload } = req.body;
    const handler = funcoesRequest[request];

    if (!handler) {
      return res.status(404).json({
        error: true,
        message: "Requisição desconhecida",
      });
    }

    const response = await handler(payload);
    const { error, content, message, status } = response.data;

    return res.status(status || 200).json({
      error,
      content,
      message,
    });
  } catch (err) {
    console.error("[gateway] Erro em /requisicao:", err.message);
    res.status(500).json({
      error: true,
      message: "Erro interno no gateway",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`[gateway] Rodando em ${base}:${PORT}`);
  console.log(`[gateway] Auth    → ${base}:${svc.auth}`);
  console.log(`[gateway] User    → ${base}:${svc.user}`);
  console.log(`[gateway] Catalog → ${base}:${svc.catalog}`);
});

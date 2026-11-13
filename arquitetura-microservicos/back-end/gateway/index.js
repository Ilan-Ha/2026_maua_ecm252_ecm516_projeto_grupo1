import express from "express";
import cors from "cors";
import config from "../utlis/config.js";
import axios from "axios";

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.gateway;
const base = config.k8s.url;
const clusterIp = config.k8s.services.clusterIP

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

const returnData = (response) => {
  const { error, content, message, status } = response.data;
  return { error, status, content, message };
};

async function callAuth(path, payload) {
  const response = await axios.post(`${base}${clusterIp.auth}:${svc.auth}${path}`, { payload });
  return response.data;
}

async function proxyToReview(method, targetPath, req, res) {
  try {
    const url = `${base}${clusterIp.review}:${svc.review}${targetPath}`;
    const response = await axios({
      method,
      url,
      data: method === "POST" ? req.body : undefined,
      validateStatus: () => true,
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("[gateway] Erro no proxy review:", err.message);
    res.status(502).json({ error: "Serviço de avaliações indisponível" });
  }
}

app.get("/health", async (req, res) => {
  const checks = await Promise.allSettled([
    axios.get(`${base}${clusterIp.catalog}:${svc.catalog}/health`, { timeout: 3000 }),
    axios.get(`${base}${clusterIp.auth}:${svc.auth}/health`, { timeout: 3000 }),
    axios.get(`${base}${clusterIp.user}:${svc.user}/health`, { timeout: 3000 }),
    axios.get(`${base}${clusterIp.review}:${svc.review}/health`, { timeout: 3000 }),
  ]);

  const ok = (result) =>
    result.status === "fulfilled" &&
    (result.value?.data?.backend === true ||
      result.value?.data?.status === "ok" ||
      result.value?.data?.db === true);

  const catalogOk = ok(checks[0]);
  const authOk = ok(checks[1]);
  const userOk = ok(checks[2]);
  const reviewOk = ok(checks[3]);
  const dbOk = catalogOk || reviewOk;

  res.json({
    backend: true,
    catalog: catalogOk,
    auth: authOk,
    user: userOk,
    review: reviewOk,
    db: dbOk,
    status: catalogOk && authOk && userOk ? "ok" : "degraded",
  });
});

app.get("/health/db", async (req, res) => {
  try {
    const response = await axios.get(
      `${base}${clusterIp.catalog}:${svc.catalog}/health/db`,
      { timeout: 3000 }
    );
    const ok = response.data?.db === true || response.data?.status === "ok";
    res.json({ db: !!ok, status: ok ? "ok" : "error" });
  } catch {
    res.json({ db: false, status: "error" });
  }
});

app.get(paths.catalog.catalog, async (req, res) => {
  try {
    const response = await axios.get(`${base}${clusterIp.catalog}:${svc.catalog}${paths.catalog.catalog}`);
    const { error, status, content, message } = returnData(response);
    if (error) {
      return res.status(status || 500).json({ error: message || "Erro ao carregar catálogo" });
    }
    return res.json(content);
  } catch (err) {
    console.error("[gateway] Erro no catálogo:", err.message);
    res.status(502).json({ error: "Serviço de catálogo indisponível" });
  }
});

app.get("/produto/:id", async (req, res) => {
  try {
    const response = await axios.get(`${base}${clusterIp.catalog}:${svc.catalog}${paths.catalog.product}`, {
      params: { id: req.params.id },
    });
    const { error, status, content, message } = returnData(response);
    if (error) {
      return res.status(status || 404).json({ error: message || "Produto não encontrado" });
    }
    return res.json(content);
  } catch (err) {
    console.error("[gateway] Erro no produto:", err.message);
    res.status(502).json({ error: "Serviço de catálogo indisponível" });
  }
});

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

app.get(`${paths.review.list}/:produtoId`, (req, res) =>
  proxyToReview("GET", `${paths.review.list}/${req.params.produtoId}`, req, res)
);

app.post(paths.review.create, (req, res) =>
  proxyToReview("POST", paths.review.create, req, res)
);

const funcoesRequestPost = {
  [paths.auth.register]: (payload) =>
    axios.post(`${base}${clusterIp.auth}:${svc.auth}${paths.auth.register}`, { payload }),
  [paths.auth.login]: (payload) =>
    axios.post(`${base}${clusterIp.auth}:${svc.auth}${paths.auth.login}`, { payload }),
  [paths.auth.update.password]: (payload) =>
    axios.post(`${base}${clusterIp.auth}:${svc.auth}${paths.auth.update.password}`, { payload }),
  [paths.history.history]: (payload) => 
    axios.post(`${base}${clusterIp.history}:${svc.history}${paths.history.history}`, { payload })
};

const funcoesRequestGet = {
  [paths.catalog.catalog]: () =>
    axios.get(`${base}${clusterIp.catalog}:${svc.catalog}${paths.catalog.catalog}`),
  [paths.catalog.product]: (payload) =>
    axios.get(`${base}${clusterIp.catalog}:${svc.catalog}${paths.catalog.product}`, {
      params: { id: payload.id },
    }),
};

app.post(paths.gateway.request, async (req, res) => {
  try {
    const { request, payload } = req.body;
    const handler = funcoesRequestPost[request];
    if (!handler) {
      return res.status(404).json({ error: true, message: "Requisição desconhecida" });
    }

    const response = await handler(payload);
    const { error, status, content, message } = returnData(response);

    return res.status(status || 200).json({ error, content, message });
  } catch (err) {
    console.error("[gateway] Erro em POST /requisicao:", err.message);
    res.status(500).json({ error: true, message: "Erro interno no gateway" });
  }
});

app.get(paths.gateway.request, async (req, res) => {
  try {
    const { request } = req.query;
    const handler = funcoesRequestGet[request];

    if (!handler) {
      return res.status(404).json({ error: true, message: "Requisição desconhecida" });
    }

    const response = await handler(req.query);
    const { error, status, content, message } = returnData(response);

    return res.status(status || 200).json({ error, content, message });
  } catch (err) {
    console.error("[gateway] Erro em GET /requisicao:", err.message);
    res.status(500).json({ error: true, message: "Erro interno no gateway" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`[gateway] Rodando em ${base}${config.k8s.services.nodePort.gateway}:${PORT}`);
  console.log(`[gateway] Auth    → ${base}${clusterIp.auth}:${svc.auth}`);
  console.log(`[gateway] Catalog → ${base}${clusterIp.catalog}:${svc.catalog}`);
  console.log(`[gateway] Review  → ${base}${clusterIp.review}:${svc.review}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import config from "../../mss/shared/utils/config.js";
import Gateway from "./Gateway.js";
import { requireAuth } from "./auth.js";
import {
  emptyGatewayFields,
  extractUsuario,
  formatMssMessage,
  isGatewayTransportError,
  parseMssResponse,
} from "../../shared/utils/gateway/mssResponse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
for (const envPath of [
  path.join(__dirname, "../../../.env"),
  path.join(__dirname, "../../.env"),
  path.join(__dirname, "../.env"),
]) {
  dotenv.config({ path: envPath, override: true, quiet: true });
}

const svc = config.ports.back;
const paths = config.paths;
const PORT = svc.gateway;
const base = config.url;

const app = express();
app.use(cors());
app.use(express.json());

const gateway = new Gateway();

const endpoints = {
  authLogin: `${base}:${svc.auth}${paths.auth.login}`,
  authRegister: `${base}:${svc.auth}${paths.auth.register}`,
  authRefresh: `${base}:${svc.auth}${paths.auth.refresh}`,
  authLogout: `${base}:${svc.auth}${paths.auth.logout}`,
  authPassword: `${base}:${svc.auth}${paths.auth.update.password}`,
  catalogList: `${base}:${svc.catalog}${paths.catalog.catalog}`,
  catalogProduct: `${base}:${svc.catalog}${paths.catalog.product}`,
  reviewList: `${base}:${svc.review}${paths.review.list}`,
  reviewCreate: `${base}:${svc.review}${paths.review.create}`,
  reviewHealth: `${base}:${svc.review}/health`,
  history: `${base}:${svc.history}${paths.history.history}`,
} as const;

for (const [name, url] of Object.entries(endpoints)) {
  gateway.registerEndpoint({ name, description: name, url });
}

function transportErrorResponse(res: express.Response, status: number) {
  return res.status(status).json({ message: "Erro ao conectar com o servidor" });
}

function sessionFromContent(content: unknown) {
  const raw = (content ?? {}) as Record<string, unknown>;
  return {
    usuario: extractUsuario(raw),
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    expiresIn: raw.expiresIn,
    tokenType: raw.tokenType || "Bearer",
  };
}

app.post(paths.auth.login, async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await gateway.makeRequest({
      method: "POST",
      endpointName: "authLogin",
      body: { payload: { email, senha } },
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return transportErrorResponse(res, result.status);
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 401)
        .json({ message: formatMssMessage(data.message) });
    }

    return res.json({
      message: data.message || "Login OK",
      ...sessionFromContent(data.content),
    });
  } catch (err) {
    console.error("[gateway] Erro no login:", err);
    res.status(500).json({ message: "Erro ao conectar com o servidor" });
  }
});

app.post(paths.auth.refresh, async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    const result = await gateway.makeRequest({
      method: "POST",
      endpointName: "authRefresh",
      body: { payload: { refreshToken } },
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return transportErrorResponse(res, result.status);
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 401)
        .json({ message: formatMssMessage(data.message) });
    }

    return res.json({
      message: data.message || "Token renovado",
      ...sessionFromContent(data.content),
    });
  } catch (err) {
    console.error("[gateway] Erro no refresh:", err);
    res.status(500).json({ message: "Erro ao renovar token" });
  }
});

app.post(paths.auth.logout, async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    const result = await gateway.makeRequest({
      method: "POST",
      endpointName: "authLogout",
      body: { payload: { refreshToken } },
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return transportErrorResponse(res, result.status);
    }

    return res.json({ message: "Logout OK" });
  } catch (err) {
    console.error("[gateway] Erro no logout:", err);
    res.status(500).json({ message: "Erro ao sair" });
  }
});

app.post(paths.auth.register, async (req, res) => {
  try {
    const { nome, email, senha, confirmarSenha } = req.body;
    const result = await gateway.makeRequest({
      method: "POST",
      endpointName: "authRegister",
      body: {
        payload: { nome, email, senha, confirmarSenha: confirmarSenha || senha },
      },
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return transportErrorResponse(res, result.status);
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 400)
        .json({ message: formatMssMessage(data.message) });
    }

    return res
      .status(data.status || 201)
      .json({ message: data.message || "Usuário cadastrado" });
  } catch (err) {
    console.error("[gateway] Erro no cadastro:", err);
    res.status(500).json({ message: "Erro ao conectar com o servidor" });
  }
});

app.put(paths.user.perfil, requireAuth, async (req, res) => {
  try {
    const email = req.auth?.email || req.body?.email;
    const { nome, senha } = req.body;

    if (senha) {
      const result = await gateway.makeRequest({
        method: "POST",
        endpointName: "authPassword",
        body: { payload: { email, senha, confirmarSenha: senha } },
        ...emptyGatewayFields,
      });

      if (isGatewayTransportError(result.status)) {
        return transportErrorResponse(res, result.status);
      }

      const data = parseMssResponse(result.data);
      if (data.error) {
        return res
          .status(data.status || 400)
          .json({ message: formatMssMessage(data.message) });
      }
    }

    return res.json({
      message: "Dados atualizados",
      usuario: {
        email,
        nome: nome || req.auth?.nome,
        authId: req.auth?.sub,
      },
    });
  } catch (err) {
    console.error("[gateway] Erro no perfil:", err);
    res.status(500).json({ message: "Erro ao atualizar" });
  }
});

app.get(paths.catalog.catalog, async (_req, res) => {
  try {
    const result = await gateway.makeRequest({
      method: "GET",
      endpointName: "catalogList",
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de catálogo indisponível" });
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 500)
        .json({ error: formatMssMessage(data.message) || "Erro ao carregar catálogo" });
    }

    return res.json(data.content);
  } catch (err) {
    console.error("[gateway] Erro no catálogo:", err);
    res.status(502).json({ error: "Serviço de catálogo indisponível" });
  }
});

app.get("/produto/:id", async (req, res) => {
  try {
    const result = await gateway.makeRequest({
      method: "GET",
      endpointName: "catalogProduct",
      ...emptyGatewayFields,
      query: { id: req.params.id },
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de catálogo indisponível" });
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 404)
        .json({ error: formatMssMessage(data.message) || "Produto não encontrado" });
    }

    return res.json(data.content);
  } catch (err) {
    console.error("[gateway] Erro no produto:", err);
    res.status(502).json({ error: "Serviço de catálogo indisponível" });
  }
});

app.get(`${paths.review.list}/:produtoId`, async (req, res) => {
  try {
    const result = await gateway.makeRequest({
      method: "GET",
      endpointName: "reviewList",
      pathSuffix: req.params.produtoId,
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de avaliações indisponível" });
    }

    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("[gateway] Erro no proxy review:", err);
    res.status(502).json({ error: "Serviço de avaliações indisponível" });
  }
});

app.post(paths.review.create, requireAuth, async (req, res) => {
  try {
    const result = await gateway.makeRequest({
      method: "POST",
      endpointName: "reviewCreate",
      body: {
        ...req.body,
        email: req.auth?.email,
        nome: req.auth?.nome,
      },
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de avaliações indisponível" });
    }

    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("[gateway] Erro no proxy review:", err);
    res.status(502).json({ error: "Serviço de avaliações indisponível" });
  }
});

app.post(paths.history.history, requireAuth, async (req, res) => {
  try {
    const authId = req.auth!.sub;
    const body = {
      authId,
      productId: req.body?.productId ?? req.body?._id,
      _id: req.body?._id ?? req.body?.productId,
    };

    const result = await gateway.makeRequest({
      method: "POST",
      endpointName: "history",
      body,
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de histórico indisponível" });
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 400)
        .json({ error: formatMssMessage(data.message) || "Erro ao registrar histórico" });
    }

    return res
      .status(data.status || 200)
      .json({ message: data.message || "Acesso registrado" });
  } catch (err) {
    console.error("[gateway] Erro no histórico:", err);
    res.status(502).json({ error: "Serviço de histórico indisponível" });
  }
});

app.get(paths.history.history, requireAuth, async (req, res) => {
  try {
    const authId = req.auth!.sub;

    const result = await gateway.makeRequest({
      method: "GET",
      endpointName: "history",
      ...emptyGatewayFields,
      query: { authId },
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de histórico indisponível" });
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 400)
        .json({ error: formatMssMessage(data.message) || "Erro ao carregar histórico" });
    }

    return res.status(data.status || 200).json({
      error: false,
      content: data.content ?? [],
    });
  } catch (err) {
    console.error("[gateway] Erro ao listar histórico:", err);
    res.status(502).json({ error: "Serviço de histórico indisponível" });
  }
});

app.delete(paths.history.history, requireAuth, async (req, res) => {
  try {
    const authId = req.auth!.sub;

    const result = await gateway.makeRequest({
      method: "DELETE",
      endpointName: "history",
      ...emptyGatewayFields,
      query: { authId },
    });

    if (isGatewayTransportError(result.status)) {
      return res.status(502).json({ error: "Serviço de histórico indisponível" });
    }

    const data = parseMssResponse(result.data);
    if (data.error) {
      return res
        .status(data.status || 400)
        .json({ error: formatMssMessage(data.message) || "Erro ao limpar histórico" });
    }

    return res
      .status(data.status || 200)
      .json({ message: data.message || "Histórico limpo" });
  } catch (err) {
    console.error("[gateway] Erro ao limpar histórico:", err);
    res.status(502).json({ error: "Serviço de histórico indisponível" });
  }
});

app.get("/health", async (_req, res) => {
  const [catalogResult, reviewResult] = await Promise.all([
    gateway.makeRequest({
      method: "GET",
      endpointName: "catalogList",
      ...emptyGatewayFields,
    }),
    gateway.makeRequest({
      method: "GET",
      endpointName: "reviewHealth",
      ...emptyGatewayFields,
    }),
  ]);

  const catalogData = parseMssResponse(catalogResult.data);
  const catalogOk = !catalogData.error && Boolean(catalogData.content);

  const reviewBody = reviewResult.data as Record<string, unknown> | undefined;
  const reviewDb = reviewBody?.db === true;

  res.json({
    backend: true,
    catalog: catalogOk,
    db: catalogOk || reviewDb,
    status: catalogOk ? "ok" : "degraded",
  });
});

app.get("/health/db", async (_req, res) => {
  try {
    const result = await gateway.makeRequest({
      method: "GET",
      endpointName: "catalogList",
      ...emptyGatewayFields,
    });

    if (isGatewayTransportError(result.status)) {
      return res.json({ db: false, status: "error" });
    }

    const data = parseMssResponse(result.data);
    const ok = !data.error;
    res.json({ db: ok, status: ok ? "ok" : "error" });
  } catch {
    res.json({ db: false, status: "error" });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`[gateway] Rodando em ${base}:${PORT}`);
  console.log(`[gateway] Auth    → ${base}:${svc.auth}`);
  console.log(`[gateway] Catalog → ${base}:${svc.catalog}`);
  console.log(`[gateway] Review  → ${base}:${svc.review}`);
  console.log(`[gateway] History → ${base}:${svc.history}`);
});

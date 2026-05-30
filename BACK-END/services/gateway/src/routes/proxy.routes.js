import { Router } from "express";
import { catalogBase, legacyBase } from "../config.js";
import {
  forwardRequest,
  isCatalogRoute,
} from "../services/proxy.service.js";

const router = Router();

router.use(async (req, res, next) => {
  if (req.path === "/health" || req.path === "/health/db") {
    return next();
  }

  const target = isCatalogRoute(req.path) ? catalogBase : legacyBase;

  try {
    await forwardRequest(target, req, res);
  } catch (err) {
    console.error("[gateway] Erro no proxy:", err.message);
    res.status(502).json({
      error: "Serviço indisponível",
      target,
    });
  }
});

export default router;

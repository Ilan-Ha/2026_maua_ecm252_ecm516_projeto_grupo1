import { Router } from "express";
import { isDatabaseConnected } from "../db/connection.js";

const router = Router();

router.get("/health", (req, res) => {
  const dbOk = isDatabaseConnected();
  res.json({
    service: "catalog",
    backend: true,
    db: dbOk,
    status: dbOk ? "ok" : "degraded",
  });
});

router.get("/health/db", (req, res) => {
  const dbOk = isDatabaseConnected();
  res.json({
    service: "catalog",
    db: dbOk,
    status: dbOk ? "ok" : "error",
  });
});

export default router;

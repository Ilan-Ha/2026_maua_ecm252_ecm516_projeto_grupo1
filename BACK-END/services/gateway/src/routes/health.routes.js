import { Router } from "express";
import { getDbHealth, getHealth } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", getHealth);
router.get("/health/db", getDbHealth);

export default router;

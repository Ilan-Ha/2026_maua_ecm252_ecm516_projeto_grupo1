import { Router } from "express";
import healthRoutes from "./health.routes.js";
import proxyRoutes from "./proxy.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(proxyRoutes);

export default router;

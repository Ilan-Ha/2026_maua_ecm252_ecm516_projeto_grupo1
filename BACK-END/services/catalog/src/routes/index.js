import { Router } from "express";
import catalogRoutes from "./catalog.routes.js";
import productRoutes from "./product.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(catalogRoutes);
router.use(productRoutes);

export default router;

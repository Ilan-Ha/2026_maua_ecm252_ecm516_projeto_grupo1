import { Router } from "express";
import { getProductById } from "../controllers/product.controller.js";
import { endpoints } from "../config.js";

const router = Router();
router.get(`${endpoints.produto}/:id`, getProductById);

export default router;

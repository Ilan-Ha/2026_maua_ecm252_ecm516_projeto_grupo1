import { Router } from "express";
import { getCatalog } from "../controllers/catalog.controller.js";
import { endpoints } from "../config.js";

const router = Router();
router.get(endpoints.catalog, getCatalog);

export default router;

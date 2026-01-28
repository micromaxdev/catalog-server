import express from "express";
import { getProductDocuments } from "../controllers/documentController.js";

const router = express.Router();

router.get("/products/:model_number/documents", getProductDocuments);

export default router;
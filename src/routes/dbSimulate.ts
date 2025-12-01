import express from "express";
import { simulateDB } from "../controllers/dbController";
// Simulate routes
const router = express.Router();

router.get("/db", simulateDB);

export default router;
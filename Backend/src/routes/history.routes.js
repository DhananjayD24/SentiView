import express from "express";
import firebaseAuth from "../middleware/firebaseAuth.middleware.js";
import {
  getUserHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/history.controller.js";

const router = express.Router();

router.get("/", firebaseAuth, getUserHistory);
router.get("/:id", firebaseAuth, getAnalysisById);
router.delete("/:id", firebaseAuth, deleteAnalysis);

export default router;

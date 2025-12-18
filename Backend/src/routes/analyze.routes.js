import express from "express";
import { analyze } from "../controllers/analyze.controller.js";
import firebaseAuth from "../middleware/firebaseAuth.middleware.js";


const router = express.Router();

router.post("/", firebaseAuth, analyze);

export default router;

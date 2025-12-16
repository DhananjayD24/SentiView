import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import analyzeRoutes from "./routes/analyze.routes.js";
app.use("/api/analyze", analyzeRoutes);

export default app;

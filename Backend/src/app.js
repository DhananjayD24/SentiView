import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 Import and use analyze controller routes
import analyzeRoutes from "./routes/analyze.routes.js";
app.use("/api/analyze", analyzeRoutes);

// 🔹 Import and use history controller routes
import historyRoutes from "./routes/history.routes.js";
app.use("/api/history", historyRoutes);

export default app;

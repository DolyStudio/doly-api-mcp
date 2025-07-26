import { Default404Page, DefaultHealthCheck } from "@repo/shared/index";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { api } from "./handlers/api";

const app = express();
const PORT = process.env.PORT || 3000;

app
  .use(helmet())
  .use(cors())
  .use(morgan("combined"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get("/", api)
  .get("/health", (_, res) => DefaultHealthCheck(res))
  .get("/*", (_, res) => Default404Page(res));

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

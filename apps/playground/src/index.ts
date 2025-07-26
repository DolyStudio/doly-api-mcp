import { print } from "@repo/shared/utils";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: print(),
  });
});

// 404 핸들러
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// 에러 핸들러
// app.use(
//   (
//     err: Error,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     console.error(err.stack);
//     res.status(500).json({
//       error: "Internal Server Error",
//       message:
//         process.env.NODE_ENV === "production"
//           ? "Something went wrong!"
//           : err.message,
//     });
//   }
// );

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import paymentsRouter from "./routes/payments";
import smsRouter from "./routes/sms";
import ordersRouter from "./routes/orders";
import healthRouter from "./routes/health";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(","),
  credentials: true,
}));

// ── Rate limiting (prevent abuse) ─────────────────────────────────
app.use("/api/payments", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: "Too many payment requests. Try again in 15 minutes." },
}));

app.use("/api/sms", rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: "Too many OTP requests. Wait 10 minutes." },
}));

// ── Parsers ───────────────────────────────────────────────────────
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/sms", smsRouter);
app.use("/api/orders", ordersRouter);

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Soko Link API running on port ${PORT}`);
  console.log(`📱 M-Pesa: ${process.env.MPESA_ENVIRONMENT || "sandbox"} mode`);
  console.log(`💬 SMS: Africa's Talking (${process.env.AT_USERNAME || "sandbox"})\n`);
});

export default app;

import rateLimit from "express-rate-limit";
import { Express } from "express";

const limiter = rateLimit({
  max: 5,
  windowMs: 1 * 60 * 1000, // 1 minute
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export function initRateLimit(app: Express) {
  app.use(limiter);
}


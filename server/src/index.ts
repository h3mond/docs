import express from "express";
import mongoose from "mongoose";
import { existsSync, mkdirSync } from "fs";
import { initRoutes } from "./routes/index";
import { initCORS } from "./bootstrap/cors.bootstrap";
import { MONGODB_DB, MONGODB_HOST, MONGODB_PASS, MONGODB_USER } from "./env";
import passport from "passport";
import { passportConfig } from "./config/passport.config";

const MONGO_URL = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:27017`;

if (!existsSync("./tmp")) {
  mkdirSync("./tmp");
}

(async function () {
  console.log("Connection string", MONGO_URL);
  await mongoose.connect(MONGO_URL);

  const port = 3001;
  const app = express();

  app.use(express.json());
  app.use(passport.initialize());
  app.use(express.urlencoded({ extended: false }));

  passportConfig(passport);

  initCORS(app);
  initRoutes(app);

  app.listen(port, () => {
    console.log(`started at http://localhost:${port}`);
  });
})();

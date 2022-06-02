import { Express } from "express";
import accountRouter from "./account.route";
import documentRouter from "./document.route";
import studentRouter from "./student.route";
import templateRouter from "./template.route";

export function initRoutes(app: Express) {
  app.use("/api/account", accountRouter);
  app.use("/api/document", documentRouter);
  app.use("/api/student", studentRouter);
  app.use("/api/template", templateRouter);
}

import { Router } from "express";
import passport from "passport";
import {
  addHandler,
  allHandler,
  deleteHandler,
  generateHandler,
} from "../controllers/template.controller";
const multer = require("multer");

const upload = multer({ dest: "./tmp" });

const router = Router();

router.get("/all", allHandler);
router.post("/add", upload.single("document"), addHandler);
router.get("/delete", passport.authenticate("jwt", { session: false }), deleteHandler);
router.get("/generate", generateHandler);

export default router;

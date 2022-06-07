import { Router } from "express";
import {
  downloadHandler,
  showHandler,
  signHandler,
  verifyHandler,
  studentHandler
} from "../controllers/document.controller";
const multer = require("multer");

const upload = multer({ dest: "./tmp" });

const router = Router();

router.get("/show", showHandler);
router.get("/student", studentHandler);
router.get("/download", downloadHandler);
router.post("/sign", signHandler);
router.post("/verify", upload.single("document"), verifyHandler);
// router.post("/verify", verifyHandler);

export default router;

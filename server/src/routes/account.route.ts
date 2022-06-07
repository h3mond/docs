import { Router } from "express";
import passport from "passport";
import { getAdministrativeAccountsHandler, loginHandler, registerController, verifyController } from "../controllers/account.controller";

const router = Router();

router.post("/login", loginHandler);
router.post("/register", registerController);
router.get("/get-administrative", getAdministrativeAccountsHandler);
router.get("/verify", passport.authenticate("jwt", { session: false }), verifyController);

export default router;

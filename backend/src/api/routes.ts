import { Router } from "express";
import auth from "./auth";
import me from "./me";
import messages from "./messages";

const router = Router();

router.use("/auth", auth);
router.use("/me", me);
router.use("/messages", messages);

export default router;

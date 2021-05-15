import { Router } from "express";
import auth from "./auth";
import me from "./me";

const router = Router();

router.use("/auth", auth);
router.use("/me", me);

export default router;

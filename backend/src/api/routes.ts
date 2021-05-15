import { Router } from "express";
import auth from "./auth";
import bloodTypes from "./bloodTypes";
import me from "./me";
import messages from "./messages";

const router = Router();

router.use("/auth", auth);
router.use("/blood-types", bloodTypes);
router.use("/me", me);
router.use("/messages", messages);

export default router;

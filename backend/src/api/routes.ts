import { Router } from "express";

import events from "./events";
import privileges from "./privileges";
import auth from "./auth";
import bloodTypes from "./bloodTypes";
import me from "./me";
import messages from "./messages";

const router = Router();

router.use("/auth", auth);
router.use("/blood-types", bloodTypes);
router.use("/me", me);
router.use("/messages", messages);
router.use("/events", events);
router.use("/privileges", privileges);

export default router;

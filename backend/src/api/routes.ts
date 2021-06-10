import { Router } from "express";
import auth from "./auth";
import bloodTypes from "./bloodTypes";
import donations from "./donations";
import events from "./events";
import me from "./me";
import messages from "./messages";
import privileges from "./privileges";
import receipts from "./receipts";

const router = Router();

router.use("/auth", auth);
router.use("/blood-types", bloodTypes);
router.use("/donations", donations);
router.use("/events", events);
router.use("/me", me);
router.use("/messages", messages);
router.use("/privileges", privileges);
router.use("/receipts", receipts);

export default router;

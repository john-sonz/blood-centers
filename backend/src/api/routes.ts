import { Router } from "express";

import donations from "./donations";
import receipts from "./receipts";

import auth from "./auth";
import bloodTypes from "./bloodTypes";
import me from "./me";
import messages from "./messages";

const router = Router();

router.use("/auth", auth);
router.use("/blood-types", bloodTypes);
router.use("/me", me);
router.use("/messages", messages);

router.use("/donations", donations);

router.use("/receipts", receipts);

export default router;

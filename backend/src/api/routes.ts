import { Router } from "express";
import users from "./users";
import donations from "./donations";
import receipts from "./receipts";

const router = Router();

router.use("/users", users);

router.use("/donations", donations);

router.use("/receipts", receipts);

export default router;

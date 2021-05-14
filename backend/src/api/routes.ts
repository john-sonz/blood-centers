import { Router } from "express";
import users from "./users";
import events from "./events";
import privileges from "./privileges";

const router = Router();

router.use("/users", users);
router.use("/events", events);
router.use("/privileges", privileges);

export default router;

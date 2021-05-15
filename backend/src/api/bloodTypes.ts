import { BloodType } from "../entities/User";
import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ bloodTypes: Object.values(BloodType) });
});

export default router;

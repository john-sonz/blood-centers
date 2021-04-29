import { Router } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";

const router = Router();

router.get("/", async (_req, res) => {
  const userRepo = getRepository(User);
  const users = await userRepo.find();
  return res.json(users);
});

router.get("/:id", async (req, res) => {
  const userRepo = getRepository(User);
  const result = await userRepo.findOne(req.params.id);

  if (!result) return res.status(404).json({ msg: "User not found" });
  return res.json(result);
});

router.post("/", async (req, res) => {
  const userRepo = getRepository(User);
  const user = userRepo.create(req.body);
  const result = await userRepo.save(user);
  return res.json(result);
});

router.put("/:id", async (req, res) => {
  const userRepo = getRepository(User);
  const user = await userRepo.findOne(req.params.id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  userRepo.merge(user, req.body);
  const results = await userRepo.save(user);
  return res.json(results);
});

router.delete("/:id", async (req, res) => {
  const userRepo = getRepository(User);
  const result = await userRepo.delete(req.params.id);
  return res.json(result);
});

export default router;

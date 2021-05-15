import { Router } from "express";
import { Privilege } from "../entities/Privilege";
import { Donation } from "../entities/Donation";
import { getRepository, LessThanOrEqual } from "typeorm";

const router = Router();

router.get("/:userId", async (req, res) => {
  const donationsRepo = getRepository(Donation);
  const user_donations = await donationsRepo.find({donatorId: parseInt(req.params.userId)});

  let blood_sum = 0

  for (const donation of user_donations){
    blood_sum+=donation.amountMl;
  }

  const privilegeRepo = getRepository(Privilege);
  const user_privileges = await privilegeRepo.find({ min_donated_amount_ml: LessThanOrEqual(blood_sum)});
  return res.json(user_privileges);
});

router.get("/", async (_req, res) => {
  const privilegeRepo = getRepository(Privilege);
  const privileges = await privilegeRepo.find();
  return res.json(privileges);
});

router.get("/:id", async (req, res) => {
  const privilegeRepo = getRepository(Privilege);
  const result = await privilegeRepo.findOne(req.params.id);

  if (!result) return res.status(404).json({ msg: "Privilege not found" });
  return res.json(result);
});

router.post("/", async (req, res) => {
  const privilegeRepo = getRepository(Privilege);
  const privilege = privilegeRepo.create(req.body);
  const result = await privilegeRepo.save(privilege);
  return res.json(result);
});

router.put("/:id", async (req, res) => {
  const privilegeRepo = getRepository(Privilege);
  const privilege = await privilegeRepo.findOne(req.params.id);
  if (!privilege) return res.status(404).json({ msg: "Privilege not found" });

  privilegeRepo.merge(privilege, req.body);
  const results = await privilegeRepo.save(privilege);
  return res.json(results);
});

router.delete("/:id", async (req, res) => {
  const privilegeRepo = getRepository(Privilege);
  const result = await privilegeRepo.delete(req.params.id);
  return res.json(result);
});

export default router;

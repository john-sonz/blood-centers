import { LessThanOrEqual, getRepository } from "typeorm";

import { Donation } from "../entities/Donation";
import { Privilege } from "../entities/Privilege";
import { Router } from "express";
import isAuthorized from "../middleware/isAuthorized";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const donationsRepo = getRepository(Donation);
    const user_donations = await donationsRepo.find({
      donatorId: req.params.userId,
    });

    let blood_sum = 0;

    for (const donation of user_donations) {
      blood_sum += donation.amountMl;
    }

    const privilegeRepo = getRepository(Privilege);
    const user_privileges = await privilegeRepo.find({
      min_donated_amount_ml: LessThanOrEqual(blood_sum),
    });
    return res.json(user_privileges);
  } catch (error) {
    console.warn(error, req.body);
    return res.status(500);
  }
});

router.get("/", async (_req, res) => {
  try {
    const privilegeRepo = getRepository(Privilege);
    const privileges = await privilegeRepo.find();
    return res.json(privileges);
  } catch (error) {
    console.warn(error, _req.body);
    return res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const privilegeRepo = getRepository(Privilege);
    const result = await privilegeRepo.findOne(req.params.id);

    if (!result) return res.status(404).json({ msg: "Privilege not found" });
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.status(500);
  }
});

router.post("/", isAuthorized(), async (req, res) => {
  try {
    const privilegeRepo = getRepository(Privilege);
    const privilege = privilegeRepo.create(req.body);
    const result = await privilegeRepo.save(privilege);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.status(500);
  }
});

router.put("/:id", isAuthorized(), async (req, res) => {
  try {
    const privilegeRepo = getRepository(Privilege);
    const privilege = await privilegeRepo.findOne(req.params.id);
    if (!privilege) return res.status(404).json({ msg: "Privilege not found" });

    privilegeRepo.merge(privilege, req.body);
    const results = await privilegeRepo.save(privilege);
    return res.json(results);
  } catch (error) {
    console.warn(error, req.body);
    return res.status(500);
  }
});

router.delete("/:id", isAuthorized(), async (req, res) => {
  try {
    const privilegeRepo = getRepository(Privilege);
    const result = await privilegeRepo.delete(req.params.id);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.status(500);
  }
});

export default router;

import { LessThanOrEqual, getRepository } from "typeorm";

import { Donation } from "../entities/Donation";
import { Privilege } from "../entities/Privilege";
import { Router } from "express";
import isAuthorized from "../middleware/isAuthorized";

const router = Router();

router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const allPrivileges = Boolean(req.query.allPrivileges);

    const bloodSum: number = await getRepository(Donation)
      .createQueryBuilder("donation")
      .select("SUM(donation.amountMl)")
      .where("donation.donatorId = :userId", { userId })
      .getRawOne();

    const privilegeRepo = getRepository(Privilege);
    const privileges = await privilegeRepo.find({
      where: allPrivileges
        ? undefined
        : [{ minDonatedAmountMl: LessThanOrEqual(bloodSum) }],
      order: { minDonatedAmountMl: "ASC" },
    });

    res.json({ privileges, donatedMl: bloodSum });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const privilegeRepo = getRepository(Privilege);
    const privileges = await privilegeRepo.find();
    res.json({ privileges });
  } catch (error) {
    next(error);
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

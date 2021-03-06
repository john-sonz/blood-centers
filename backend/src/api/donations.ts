import { Donation } from "../entities/Donation";
import { Router } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const donationRepo = getRepository(Donation);
    const donations = await donationRepo
      .createQueryBuilder("donation")
      .innerJoin("donation.donator", "donator")
      .addSelect(["donator.bloodType"])
      .orderBy("donation.date", "DESC")
      .getMany();

    res.json({ donations });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const donationRepo = getRepository(Donation);
    const result = await donationRepo.findOne(req.params.id);

    if (!result) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    return res.json({ result });
  } catch (error) {
    console.warn(error);
    return res.status(500);
  }
});

router.post("/", async (req, res) => {
  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ id: req.body.donatorId });
    if (!user) {
      console.log(user);
      return res.status(400).json({ error: "User not exists" });
    }

    const donationRepo = getRepository(Donation);
    const donation = donationRepo.create(req.body);
    const result = await donationRepo.save(donation);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.get("/bloodType/:id", async (req, res) => {
  try {
    const donationRepo = getRepository(Donation);
    const result = await donationRepo.findOne(req.params.id);
    const donatorId = result?.donatorId;

    const userRepo = getRepository(User);
    const userResult = await userRepo.findOne(donatorId);

    if (!userResult) {
      return res.status(404).json({ msg: "Donation not found" });
    }

    return res.json(userResult.bloodType);
  } catch (error) {
    console.warn(error);
    return res.status(500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const donationRepo = getRepository(Donation);
    const result = await donationRepo.delete(req.params.id);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.params.id);
    return res.sendStatus(500);
  }
});

export default router;

import { LessThanOrEqual, getRepository } from "typeorm";

import { Donation } from "../entities/Donation";
import { Message } from "../entities/Message";
import { Privilege } from "../entities/Privilege";
import { Router } from "express";
import { User } from "../entities/User";
import isAuthorized from "../middleware/isAuthorized";

const router = Router();

router.use(isAuthorized());

router.get("/", async (req, res, next) => {
  try {
    const repo = getRepository(User);
    const user = await repo.findOne(req.session.userId);
    if (!user) res.status(404).json({ error: "User not found" });
    else res.json({ me: user });
  } catch (error) {
    next(error);
  }
});

router.get("/messages", async (req, res, next) => {
  try {
    const { userId } = req.session;
    const messages = await getRepository(Message).find({
      where: [{ recipientId: userId }, { senderId: userId }],
      order: { sentAt: "DESC" },
    });

    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

router.get("/privileges", async (req, res, next) => {
  try {
    const { userId } = req.session;
    const allPrivileges = Boolean(req.query.allPrivileges);
    const { sum: bloodSum }: { sum: number } = await getRepository(Donation)
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

export default router;

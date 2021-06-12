import { LessThanOrEqual, getRepository } from "typeorm";

import { Donation } from "../entities/Donation";
import { Message } from "../entities/Message";
import { Privilege } from "../entities/Privilege";
import { Receipt } from "../entities/Receipt";
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

router.get("/events", async (req, res, next) => {
  try {
    const { userId } = req.session;
    const result = await getRepository(User).findOne({
      where: [{ id: userId }],
      relations: ["events", "events.interestedUsers"],
    });

    if (!result) res.status(404).json({ error: "User not found" });
    else
      res.json({
        events: result.events.map((event) => ({
          ...event,
          totalInterested: event.interestedUsers.length,
          isInterested: event.interestedUsers.some(
            (u) => u.id === req.session.userId
          ),
          interestedUsers: undefined,
        })),
      });
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const { userId } = req.session;

    const { sum: donatedSum }: { sum: number } = await getRepository(Donation)
      .createQueryBuilder("donation")
      .select("SUM(donation.amountMl)")
      .where("donation.donatorId = :userId", { userId })
      .getRawOne();

    const { sum: receivedSum }: { sum: number } = await getRepository(Receipt)
      .createQueryBuilder("receipt")
      .select("SUM(receipt.amount)")
      .where("receipt.recipientId = :userId", { userId })
      .getRawOne();

    const donations = await getRepository(Donation).count({
      where: [{ donatorId: userId }],
    });

    const helpedPeople = await getRepository(Receipt)
      .createQueryBuilder("receipt")
      .innerJoinAndSelect("receipt.donation", "donation")
      .where("donation.donatorId = :userId", { userId })
      .getCount();

    const helpedMe = await getRepository(Receipt).count({
      where: [{ recipientId: userId }],
    });

    res.json({
      stats: {
        donatedMl: donatedSum,
        receivedMl: receivedSum,
        donations,
        helpedPeople,
        helpedMe,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

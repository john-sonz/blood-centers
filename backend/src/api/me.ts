import { Message } from "../entities/Message";
import { Donation } from "../entities/Donation";
import { Router } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import isAuthorized from "../middleware/isAuthorized";
import { Receipt } from "../entities/Receipt";

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

router.get("/donations", async (req, res, next) => {
  try {
    const { userId } = req.session;
    const donations = await getRepository(Donation).find({
      where: {donatorId: userId }
    });
    res.json({ donations });
  } catch(error) {
    next(error);
  }
});

router.get("/receipts", async (req, res, next) => {
  try {
    const { userId } = req.session;
    const receipts = await getRepository(Receipt).find({
      where: {recipientId: userId }
    });
    res.json({ receipts });
  } catch(error) {
    next(error);
  }
});

export default router;

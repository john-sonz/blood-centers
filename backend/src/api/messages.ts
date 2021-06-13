import { Message } from "../entities/Message";
import { Router } from "express";
import { getRepository } from "typeorm";
import isAuthorized from "../middleware/isAuthorized";
import { validate } from "class-validator";

const router = Router();

router.use(isAuthorized());

router.post("/", async (req, res) => {
  try {
    const repo = getRepository(Message);
    const msg = repo.create({
      ...req.body,
      senderId: req.session.userId,
    } as Message);

    const errors = await validate(msg);
    if (errors.length > 0) return res.status(400).json({ errors });

    const result = await repo.save(msg);

    return res.json({ msg: result });
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

export default router;

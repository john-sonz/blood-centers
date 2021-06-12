import { Event } from "../entities/Event";
import { Router } from "express";
import { getRepository } from "typeorm";
import isAuthorized from "../middleware/isAuthorized";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const eventRepo = getRepository(Event);
    const events = await eventRepo.find({ order: { date: "DESC" } });
    res.json({ events });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const result = await eventRepo.findOne(req.params.id);

    if (!result) return res.status(404).json({ msg: "Event not found" });
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.post("/", isAuthorized(), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const event = eventRepo.create(req.body);
    const result = await eventRepo.save(event);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.put("/:id", isAuthorized(), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const event = await eventRepo.findOne(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    eventRepo.merge(event, req.body);
    const results = await eventRepo.save(event);
    return res.json(results);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.delete("/:id", isAuthorized(), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const result = await eventRepo.delete(req.params.id);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

export default router;

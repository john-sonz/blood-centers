import { Router } from "express";
import { Event } from "../entities/Event";
import { getRepository } from "typeorm";

const router = Router();

router.get("/", async (_req, res) => {
  const eventRepo = getRepository(Event);
  const events = await eventRepo.find();
  return res.json(events);
});

router.get("/:id", async (req, res) => {
  const eventRepo = getRepository(Event);
  const result = await eventRepo.findOne(req.params.id);

  if (!result) return res.status(404).json({ msg: "Event not found" });
  return res.json(result);
});

router.post("/", async (req, res) => {
  const eventRepo = getRepository(Event);
  const event = eventRepo.create(req.body);
  const result = await eventRepo.save(event);
  return res.json(result);
});

router.put("/:id", async (req, res) => {
  const eventRepo = getRepository(Event);
  const event = await eventRepo.findOne(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });

  eventRepo.merge(event, req.body);
  const results = await eventRepo.save(event);
  return res.json(results);
});

router.delete("/:id", async (req, res) => {
  const eventRepo = getRepository(Event);
  const result = await eventRepo.delete(req.params.id);
  return res.json(result);
});

export default router;

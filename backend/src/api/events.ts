import { Event } from "../entities/Event";
import { Router } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import isAuthorized from "../middleware/isAuthorized";

const router = Router();

router.get("/", isAuthorized(), async (req, res, next) => {
  try {
    const eventRepo = getRepository(Event);
    const events = await eventRepo.find({
      order: { date: "DESC" },
      relations: ["interestedUsers"],
    });

    res.json({
      events: events.map((event) => ({
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

router.post("/", isAuthorized(true), async (req, res) => {
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

router.put("/:id", isAuthorized(true), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const event = await eventRepo.findOne(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found!" });

    eventRepo.merge(event, req.body);
    const results = await eventRepo.save(event);
    return res.json(results);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.delete("/:id", isAuthorized(true), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const result = await eventRepo.delete(req.params.id);
    return res.json(result);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.post("/:id/interest", isAuthorized(), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const event = await eventRepo.findOne(req.params.id, {
      relations: ["interestedUsers"],
    });
    const user = await getRepository(User).findOne(req.session.userId);

    if (!event || !user)
      return res.status(404).json({ msg: "Event not found" });

    event.interestedUsers.push(user);
    await eventRepo.save(event);

    return res.sendStatus(200);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

router.delete("/:id/interest", isAuthorized(), async (req, res) => {
  try {
    const eventRepo = getRepository(Event);
    const event = await eventRepo.findOne(req.params.id, {
      relations: ["interestedUsers"],
    });

    if (!event) return res.status(404).json({ msg: "Event not found" });

    event.interestedUsers = event.interestedUsers.filter(
      (user) => user.id !== req.session.userId
    );

    await eventRepo.save(event);

    return res.sendStatus(200);
  } catch (error) {
    console.warn(error, req.body);
    return res.sendStatus(500);
  }
});

export default router;

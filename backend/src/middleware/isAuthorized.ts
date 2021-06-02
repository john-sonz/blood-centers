import { RequestHandler } from "express";
import { User } from "../entities/User";
import { getRepository } from "typeorm";

export default function isAuthorized(admin = false): RequestHandler {
  return async (req, res, next) => {
    if (!req.session.userId)
      return res.status(401).json({ error: "unauthorized" });

    if (admin) {
      const repo = getRepository(User);
      const user = await repo.findOne(req.session.userId);
      if (!user?.isAdmin)
        return res.status(401).json({ error: "unauthorized" });
    }

    return next();
  };
}

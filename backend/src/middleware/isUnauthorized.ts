import { RequestHandler } from "express";

export default function isUnauthorized(): RequestHandler {
  return (req, res, next) => {
    if (req.session.userId)
      return res.status(400).json({ error: "already authorized" });

    return next();
  };
}

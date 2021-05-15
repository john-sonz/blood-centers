import { DeepPartial, getRepository } from "typeorm";

import { Router } from "express";
import { SESSION_COOKIE } from "../consts";
import { User } from "../entities/User";
import argon2 from "argon2";
import isAuthorized from "../middleware/isAuthorized";
import isUnauthorized from "../middleware/isUnauthorized";

const router = Router();

type LoginBody = {
  pesel: string;
  password: string;
};

async function validateUser(
  pesel: string,
  password: string
): Promise<Omit<User, "passwordHash"> | null> {
  const repo = getRepository(User);
  const user = await repo.findOne(
    { pesel },
    { select: ["id", "passwordHash"] }
  );
  if (!user) return null;

  if (await argon2.verify(user.passwordHash, password)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: hash, ...result } = user;
    return result;
  } else return null;
}

router.post("/login", isUnauthorized(), async (req, res) => {
  try {
    const { pesel, password } = req.body as LoginBody;
    const user = await validateUser(pesel, password);
    if (!user)
      return res.status(401).json({ error: "invalid pesel or password" });

    req.session.userId = user.id;

    const result = user;
    return res.json({ user: result });
  } catch (error) {
    console.warn(error, req.body);
    return res.status(500);
  }
});

router.post("/register", isUnauthorized(), async (req, res) => {
  try {
    const repo = getRepository(User);
    const user = repo.create(req.body as DeepPartial<User>);
    user.passwordHash = await argon2.hash(req.body.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: hash, ...result } = await repo.save(user);

    req.session.userId = result.id;

    return res.json({ user: result });
  } catch (error) {
    if (error?.code == "23505")
      return res.status(400).json({ error: "user already exists" });

    console.warn(error, req.body);
    return res.status(500);
  }
});

router.post("/logout", isAuthorized(), async (req, res) => {
  if (!req.session.userId) return res.send(400);

  const status = await new Promise((resolve) => {
    req.session.destroy((err) => {
      if (err) {
        console.warn(err);
        resolve(500);
      }
      res.clearCookie(SESSION_COOKIE);
      resolve(200);
    });
  });

  return res.send(status);
});

export default router;

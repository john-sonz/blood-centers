import express, { Request, Response } from "express";

import { createConnection } from "typeorm";

const app = express();
const PORT = process.env.PORT || 4000;

const main = async () => {
  await createConnection();

  app.use(express.json());

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({ ok: "ok" });
  });

  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
};

main().catch(console.error);

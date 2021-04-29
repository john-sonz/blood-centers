import express, { Request, Response } from "express";

import cors from "cors";
import { createConnection } from "typeorm";
import helmet from "helmet";
import morgan from "morgan";
import router from "./api/routes";

const app = express();
const PORT = process.env.PORT || 4000;

const main = async () => {
  await createConnection();

  app.use(express.json());
  app.use(helmet());
  app.use(morgan("short"));
  app.use(cors());
  app.use(router);

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({ ok: "ok" });
  });

  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
};

main().catch(console.error);

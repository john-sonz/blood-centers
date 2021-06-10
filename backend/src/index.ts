import express, { Request, Response } from "express";

import { SESSION_COOKIE } from "./consts";
import connectPg from "connect-pg-simple";
import cors from "cors";
import { createConnection } from "typeorm";
import helmet from "helmet";
import morgan from "morgan";
import pg from "pg";
import router from "./api/routes";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 4000;

const pgPool = new pg.Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  user: process.env.POSTGRES_USER || "root",
  password: process.env.POSTGRES_PASSWORD || "root",
  database: process.env.POSTGRES_DB || "blood_centers",
});
const pgSession = connectPg(session);

const main = async () => {
  const connection = await createConnection();
  console.log("Running pending migrations...");
  try {
    const migrations = await connection.runMigrations({ transaction: "each" });
    migrations.map((migration) => console.log(`${migration.name} - applied`));
  } catch (error) {
    console.error("Error when running migrations:");
    console.error(error);
  }

  app.use(express.json());
  app.use(helmet());
  app.use(morgan("short"));
  app.use(cors());
  app.use(
    session({
      name: SESSION_COOKIE,
      store: new pgSession({
        pool: pgPool,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: "lax",
      },
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(router);

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({ ok: "ok" });
  });

  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
};

main().catch(console.error);

import { createConnection } from "typeorm";
import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

createConnection().then((_connection) => {
  app.use(express.json());

  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
});

module.exports = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || "root",
  password: process.env.POSTGRES_PASSWORD || "root",
  database: process.env.POSTGRES_DB || "blood_centers",
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
  synchronize: false,
  logging: true,
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migrations",
  },
};

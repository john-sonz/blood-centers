import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessions1620999491422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" (
                "sid" varchar NOT NULL COLLATE "default",
                "sess" json NOT NULL,
                "expire" timestamp(6) NOT NULL
                )
                WITH (OIDS=FALSE);
                `
    );

    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_session_expire" ON "session" ("expire");`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP INDEX IF EXISTS IDX_session_expire;");
    await queryRunner.query("DROP TABLE IF EXISTS session;");
  }
}

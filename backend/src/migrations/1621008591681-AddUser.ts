import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1621008591681 implements MigrationInterface {
  name = "AddUser1621008591681";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pesel" character varying NOT NULL, "passwordHash" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_554c50ee6fcc0bb25dab2ca94e" ON "users" ("pesel") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_554c50ee6fcc0bb25dab2ca94e"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventsAndPrivelages1623309964589 implements MigrationInterface {
  name = "AddEventsAndPrivelages1623309964589";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "receipt" RENAME COLUMN "ammount" TO "amount"`
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "city" character varying NOT NULL, "adress" character varying NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "privileges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "min_donated_amount_ml" integer NOT NULL, CONSTRAINT "PK_13f3ff98ae4d5565ec5ed6036cd" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "privileges"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(
      `ALTER TABLE "receipt" RENAME COLUMN "amount" TO "ammount"`
    );
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReceiptAndDonationn1622381854890 implements MigrationInterface {
  name = "AddReceiptAndDonationn1622381854890";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "receipt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "receipentId" uuid NOT NULL, "donationId" uuid NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "ammount" integer NOT NULL, CONSTRAINT "PK_b4b9ec7d164235fbba023da9832" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "donation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "donatorId" uuid NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "amountMl" integer NOT NULL, "availableMl" integer NOT NULL, CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "receipt" ADD CONSTRAINT "FK_4d14f8bea0784eca2c0ff9914e8" FOREIGN KEY ("donationId") REFERENCES "donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "receipt" DROP CONSTRAINT "FK_4d14f8bea0784eca2c0ff9914e8"`
    );
    await queryRunner.query(`DROP TABLE "donation"`);
    await queryRunner.query(`DROP TABLE "receipt"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class PluralizeTableNames1623340092808 implements MigrationInterface {
  name = "PluralizeTableNames1623340092808";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" RENAME COLUMN "adress" TO "address"`
    );
    await queryRunner.query(
      `ALTER TABLE "privileges" RENAME COLUMN "min_donated_amount_ml" TO "minDonatedAmountMl"`
    );

    await queryRunner.renameTable("message", "messages");
    await queryRunner.renameTable("receipt", "receipts");
    await queryRunner.renameTable("donation", "donations");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "privileges" RENAME COLUMN "minDonatedAmountMl" TO "min_donated_amount_ml"`
    );
    await queryRunner.query(
      `ALTER TABLE "events" RENAME COLUMN "address" TO "adress"`
    );

    await queryRunner.renameTable("messages", "message");
    await queryRunner.renameTable("receipts", "receipt");
    await queryRunner.renameTable("donations", "donation");
  }
}

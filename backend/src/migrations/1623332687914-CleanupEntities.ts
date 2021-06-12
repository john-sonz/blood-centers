import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupEntities1623332687914 implements MigrationInterface {
  name = "CleanupEntities1623332687914";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "receipt" RENAME COLUMN "receipentId" TO "recipientId"`
    );
    await queryRunner.query(
      `ALTER TABLE "receipt" ADD CONSTRAINT "FK_0a96c842653dc2c6c06bcee10dc" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "donation" ADD CONSTRAINT "FK_6449c95f71a2affdc6f05eac4a5" FOREIGN KEY ("donatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donation" DROP CONSTRAINT "FK_6449c95f71a2affdc6f05eac4a5"`
    );
    await queryRunner.query(
      `ALTER TABLE "receipt" DROP CONSTRAINT "FK_0a96c842653dc2c6c06bcee10dc"`
    );
    await queryRunner.query(
      `ALTER TABLE "receipt" RENAME COLUMN "recipientId" TO "receipentId"`
    );
  }
}

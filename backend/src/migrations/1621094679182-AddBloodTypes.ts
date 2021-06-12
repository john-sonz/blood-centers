import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBloodTypes1621094679182 implements MigrationInterface {
  name = "AddBloodTypes1621094679182";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "users_bloodtype_enum" AS ENUM('AB_RH_MINUS', 'AB_RH_PLUS', 'A_RH_MINUS', 'A_RH_PLUS', 'B_RH_MINUS', 'B_RH_PLUS', 'O_RH_MINUS', 'O_RH_PLUS')`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "bloodType" "users_bloodtype_enum" NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bloodType"`);
    await queryRunner.query(`DROP TYPE "users_bloodtype_enum"`);
  }
}

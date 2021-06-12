import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsersEventsRelation1623516110961 implements MigrationInterface {
    name = 'AddUsersEventsRelation1623516110961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_events_interests" ("usersId" uuid NOT NULL, "eventsId" uuid NOT NULL, CONSTRAINT "PK_173e42125de73b3d80c4fc1bf22" PRIMARY KEY ("usersId", "eventsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f1236c741b7764e9a7d23cff1a" ON "users_events_interests" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e95901912660ddb980568fbb0" ON "users_events_interests" ("eventsId") `);
        await queryRunner.query(`ALTER TABLE "users_events_interests" ADD CONSTRAINT "FK_f1236c741b7764e9a7d23cff1a8" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_events_interests" ADD CONSTRAINT "FK_5e95901912660ddb980568fbb0f" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_events_interests" DROP CONSTRAINT "FK_5e95901912660ddb980568fbb0f"`);
        await queryRunner.query(`ALTER TABLE "users_events_interests" DROP CONSTRAINT "FK_f1236c741b7764e9a7d23cff1a8"`);
        await queryRunner.query(`DROP INDEX "IDX_5e95901912660ddb980568fbb0"`);
        await queryRunner.query(`DROP INDEX "IDX_f1236c741b7764e9a7d23cff1a"`);
        await queryRunner.query(`DROP TABLE "users_events_interests"`);
    }

}

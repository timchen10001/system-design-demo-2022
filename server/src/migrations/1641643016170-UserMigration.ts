import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1641643016170 implements MigrationInterface {
    name = 'UserMigration1641643016170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character(12) NOT NULL, "email" character(50) NOT NULL, "password" text NOT NULL, "name" character(50), "mobile" character(20), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d376a9f93bba651f32a2c03a7d" ON "users" ("mobile") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d376a9f93bba651f32a2c03a7d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

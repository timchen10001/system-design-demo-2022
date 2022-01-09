import {MigrationInterface, QueryRunner} from "typeorm";

export class UserEntityMigration1641737608128 implements MigrationInterface {
    name = 'UserEntityMigration1641737608128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying(12) NOT NULL, "email" character varying(50) NOT NULL, "password" text NOT NULL, "name" character varying(50), "mobile" character varying(20), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

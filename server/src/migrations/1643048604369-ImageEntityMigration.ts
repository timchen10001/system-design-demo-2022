import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageEntityMigration1643048604369 implements MigrationInterface {
    name = 'ImageEntityMigration1643048604369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "images" ("id" character varying NOT NULL, "type" character varying(50) NOT NULL, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "images"`);
    }

}

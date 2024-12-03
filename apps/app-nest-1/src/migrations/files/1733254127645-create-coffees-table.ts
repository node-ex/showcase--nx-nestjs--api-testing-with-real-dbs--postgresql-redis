import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCoffeesTable1733254127645 implements MigrationInterface {
    name = 'CreateCoffeesTable1733254127645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coffees" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "brand" character varying NOT NULL, "flavors" json, CONSTRAINT "PK_2c43a32ab6534261322aa94a76a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "coffees"`);
    }

}

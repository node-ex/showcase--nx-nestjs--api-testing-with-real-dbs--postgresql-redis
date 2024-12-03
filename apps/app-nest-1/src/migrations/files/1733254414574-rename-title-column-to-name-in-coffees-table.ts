import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTitleColumnToNameInCoffeesTable1733254414574 implements MigrationInterface {
    name = 'RenameTitleColumnToNameInCoffeesTable1733254414574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffees" RENAME COLUMN "title" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffees" RENAME COLUMN "name" TO "title"`);
    }

}

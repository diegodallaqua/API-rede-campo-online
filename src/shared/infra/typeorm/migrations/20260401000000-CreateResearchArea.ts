import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateResearchArea20260401000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "researcharea",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "120",
            isNullable: false,
            isUnique: true,
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "researcharea",
      new TableIndex({
        name: "IDX_researcharea_name",
        columnNames: ["name"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("researcharea");
  }
}

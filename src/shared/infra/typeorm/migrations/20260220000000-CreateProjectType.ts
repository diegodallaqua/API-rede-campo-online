import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateProjectType20260220000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projecttype",
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
      "projecttype",
      new TableIndex({
        name: "IDX_projecttype_name",
        columnNames: ["name"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("projecttype");
  }
}

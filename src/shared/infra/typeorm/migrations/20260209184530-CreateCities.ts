import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCities20260209184530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cities",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "state_id", type: "int", isNullable: false },
          { name: "name", type: "varchar", length: "120", isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "cities",
      new TableForeignKey({
        columnNames: ["state_id"],
        referencedTableName: "states",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "cities",
      new TableIndex({
        name: "IDX_CITIES_STATE_NAME_UNIQUE",
        columnNames: ["state_id", "name"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("cities");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateEvents20260304120000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "event",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "address_id", type: "int", isNullable: false },
          { name: "project_id", type: "int", isNullable: false },
          { name: "name", type: "varchar", length: "180", isNullable: false },
          { name: "date", type: "timestamp", isNullable: false },
          { name: "description", type: "varchar", length: "1000", isNullable: true },
          { name: "registration_url", type: "varchar", length: "255", isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "event",
      new TableForeignKey({
        name: "FK_events_address",
        columnNames: ["address_id"],
        referencedTableName: "address",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "event",
      new TableForeignKey({
        name: "FK_events_project",
        columnNames: ["project_id"],
        referencedTableName: "project",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "event",
      new TableIndex({
        name: "IDX_events_project_id",
        columnNames: ["project_id"],
      })
    );

    await queryRunner.createIndex(
      "event",
      new TableIndex({
        name: "IDX_events_address_id",
        columnNames: ["address_id"],
      })
    );

    await queryRunner.createIndex(
      "event",
      new TableIndex({
        name: "IDX_events_date",
        columnNames: ["date"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("event");
  }
}

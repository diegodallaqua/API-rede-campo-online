import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateEventMedia20260304133000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "eventmedia",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "event_id", type: "int", isNullable: false },
          { name: "name", type: "varchar", length: "180", isNullable: false },
          { name: "media", type: "varchar", length: "255", isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "eventmedia",
      new TableForeignKey({
        name: "FK_event_media_event",
        columnNames: ["event_id"],
        referencedTableName: "event",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "eventmedia",
      new TableIndex({
        name: "IDX_event_media_event_id",
        columnNames: ["event_id"],
      })
    );

    await queryRunner.createIndex(
      "eventmedia",
      new TableIndex({
        name: "IDX_event_media_name",
        columnNames: ["name"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("eventmedia");
  }
}

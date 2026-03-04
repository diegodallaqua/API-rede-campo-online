import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateProjectMedia20260304100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "project_media",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "project_id", type: "int", isNullable: false },
          { name: "name", type: "varchar", length: "180", isNullable: false },
          { name: "media", type: "varchar", length: "255", isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "project_media",
      new TableForeignKey({
        name: "FK_project_media_project",
        columnNames: ["project_id"],
        referencedTableName: "projects",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "project_media",
      new TableIndex({
        name: "IDX_project_media_project_id",
        columnNames: ["project_id"],
      })
    );

    await queryRunner.createIndex(
      "project_media",
      new TableIndex({
        name: "IDX_project_media_name",
        columnNames: ["name"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("project_media");
  }
}
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateProjects20260303100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projects",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "project_type_id", type: "int", isNullable: false },

          { name: "name", type: "varchar", length: "180", isNullable: false },
          { name: "description", type: "varchar", length: "1000", isNullable: false },

          { name: "status", type: "boolean", isNullable: false },

          { name: "begin_date", type: "date", isNullable: false },
          { name: "end_date", type: "date", isNullable: true },

        ],
      })
    );

    await queryRunner.createForeignKey(
      "projects",
      new TableForeignKey({
        name: "FK_projects_project_type",
        columnNames: ["project_type_id"],
        referencedTableName: "project_types",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "projects",
      new TableIndex({
        name: "IDX_projects_project_type_id",
        columnNames: ["project_type_id"],
      })
    );

    await queryRunner.createIndex(
      "projects",
      new TableIndex({
        name: "IDX_projects_name",
        columnNames: ["name"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("projects");
  }
}
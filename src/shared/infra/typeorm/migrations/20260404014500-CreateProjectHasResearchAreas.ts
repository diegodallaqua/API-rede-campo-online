import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateProjectHasResearchAreas20260311100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "project_has_research_areas",
        columns: [
          {
            name: "project_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "research_area_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "project_has_research_areas",
      new TableForeignKey({
        name: "FK_project_has_research_areas_project",
        columnNames: ["project_id"],
        referencedTableName: "projects",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "project_has_research_areas",
      new TableForeignKey({
        name: "FK_project_has_research_areas_research_area",
        columnNames: ["research_area_id"],
        referencedTableName: "research_areas",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "project_has_research_areas",
      new TableIndex({
        name: "IDX_project_has_research_areas_unique",
        columnNames: ["project_id", "research_area_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("project_has_research_areas");
  }
}
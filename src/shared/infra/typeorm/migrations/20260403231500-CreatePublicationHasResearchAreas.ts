import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreatePublicationHasResearchAreas20260311080000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "publication_has_research_areas",
        columns: [
          {
            name: "publication_id",
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
      "publication_has_research_areas",
      new TableForeignKey({
        name: "FK_publication_has_research_areas_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publications",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "publication_has_research_areas",
      new TableForeignKey({
        name: "FK_publication_has_research_areas_research_area",
        columnNames: ["research_area_id"],
        referencedTableName: "research_areas",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "publication_has_research_areas",
      new TableIndex({
        name: "IDX_publication_has_research_areas_unique",
        columnNames: ["publication_id", "research_area_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("publication_has_research_areas");
  }
}
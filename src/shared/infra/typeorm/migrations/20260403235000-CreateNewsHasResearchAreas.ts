import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateNewsHasResearchAreas20260311090000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "news_has_research_areas",
        columns: [
          {
            name: "research_area_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "news_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "news_has_research_areas",
      new TableForeignKey({
        name: "FK_news_has_research_areas_research_area",
        columnNames: ["research_area_id"],
        referencedTableName: "research_areas",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "news_has_research_areas",
      new TableForeignKey({
        name: "FK_news_has_research_areas_news",
        columnNames: ["news_id"],
        referencedTableName: "news",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "news_has_research_areas",
      new TableIndex({
        name: "IDX_news_has_research_areas_unique",
        columnNames: ["research_area_id", "news_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("news_has_research_areas");
  }
}
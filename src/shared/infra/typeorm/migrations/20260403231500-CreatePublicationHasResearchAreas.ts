import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreatePublicationHasResearchAreas20260311080000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "publicationhasresearcharea",
        columns: [
          { name: "publication_id", type: "int", isPrimary: true, isNullable: false },
          { name: "research_area_id", type: "int", isPrimary: true, isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "publicationhasresearcharea",
      new TableForeignKey({
        name: "FK_publication_has_research_areas_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "publicationhasresearcharea",
      new TableForeignKey({
        name: "FK_publication_has_research_areas_research_area",
        columnNames: ["research_area_id"],
        referencedTableName: "researcharea",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "publicationhasresearcharea",
      new TableIndex({
        name: "IDX_publication_has_research_areas_unique",
        columnNames: ["publication_id", "research_area_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("publicationhasresearcharea");
  }
}

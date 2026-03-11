import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreatePublications20260311010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "publications",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "abstract",
            type: "varchar",
            length: "2000",
            isNullable: false,
          },
          {
            name: "publication_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "doi",
            type: "varchar",
            length: "255",
            isNullable: true,
            isUnique: true,
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "publications",
      new TableIndex({
        name: "IDX_publications_title",
        columnNames: ["title"],
      })
    );

    await queryRunner.createIndex(
      "publications",
      new TableIndex({
        name: "IDX_publications_doi",
        columnNames: ["doi"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("publications");
  }
}
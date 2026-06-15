import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateExternalAuthors20260311020000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "externalauthor",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "name", type: "varchar", length: "180", isNullable: false },
          { name: "email", type: "varchar", length: "180", isNullable: true },
          { name: "orcid", type: "varchar", length: "50", isNullable: true },
        ],
      })
    );

    await queryRunner.createIndex(
      "externalauthor",
      new TableIndex({ name: "IDX_external_authors_name", columnNames: ["name"] })
    );

    await queryRunner.createIndex(
      "externalauthor",
      new TableIndex({ name: "IDX_external_authors_email", columnNames: ["email"] })
    );

    await queryRunner.createIndex(
      "externalauthor",
      new TableIndex({ name: "IDX_external_authors_orcid", columnNames: ["orcid"] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("externalauthor");
  }
}

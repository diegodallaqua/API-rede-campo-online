import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateTechnicalReports20260311050000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "thesis",
        columns: [
          { name: "publication_id", type: "int", isPrimary: true, isNullable: false },
          { name: "organization_id", type: "int", isNullable: false },
          { name: "number_of_pages", type: "int", isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "thesis",
      new TableForeignKey({
        name: "FK_thesis_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "thesis",
      new TableForeignKey({
        name: "FK_thesis_organization",
        columnNames: ["organization_id"],
        referencedTableName: "organization",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "thesis",
      new TableIndex({
        name: "IDX_thesis_organization_id",
        columnNames: ["organization_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("thesis");
  }
}

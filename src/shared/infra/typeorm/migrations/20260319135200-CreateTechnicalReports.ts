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
        name: "technical_reports",
        columns: [
          {
            name: "publication_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "organization_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "number_of_pages",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "technical_reports",
      new TableForeignKey({
        name: "FK_technical_reports_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publications",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "technical_reports",
      new TableForeignKey({
        name: "FK_technical_reports_organization",
        columnNames: ["organization_id"],
        referencedTableName: "organizations",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "technical_reports",
      new TableIndex({
        name: "IDX_technical_reports_organization_id",
        columnNames: ["organization_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("technical_reports");
  }
}
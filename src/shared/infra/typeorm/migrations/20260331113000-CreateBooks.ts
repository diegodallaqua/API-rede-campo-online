import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateBooks20260311060000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "books",
        columns: [
          {
            name: "publication_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "publisher",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "edition",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "cover_photo",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        name: "FK_books_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publications",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_publisher",
        columnNames: ["publisher"],
      })
    );

    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_edition",
        columnNames: ["edition"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("books");
  }
}
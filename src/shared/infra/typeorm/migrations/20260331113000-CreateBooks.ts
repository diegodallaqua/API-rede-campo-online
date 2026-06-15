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
        name: "book",
        columns: [
          { name: "publication_id", type: "int", isPrimary: true, isNullable: false },
          { name: "publisher", type: "varchar", length: "255", isNullable: false },
          { name: "edition", type: "varchar", length: "100", isNullable: false },
          { name: "cover_photo", type: "varchar", length: "255", isNullable: true },
          { name: "isbn", type: "varchar", length: "50", isNullable: false },
          { name: "book_url", type: "varchar", length: "255", isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "book",
      new TableForeignKey({
        name: "FK_books_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "book",
      new TableIndex({ name: "IDX_books_publisher", columnNames: ["publisher"] })
    );

    await queryRunner.createIndex(
      "book",
      new TableIndex({ name: "IDX_books_edition", columnNames: ["edition"] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("book");
  }
}

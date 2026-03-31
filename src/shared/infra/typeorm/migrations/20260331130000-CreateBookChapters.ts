import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateBookChapters20260311070000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "book_chapters",
        columns: [
          {
            name: "publication_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "book_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "chapter_number",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "book_chapters",
      new TableForeignKey({
        name: "FK_book_chapters_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publications",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "book_chapters",
      new TableIndex({
        name: "IDX_book_chapters_book_name",
        columnNames: ["book_name"],
      })
    );

    await queryRunner.createIndex(
      "book_chapters",
      new TableIndex({
        name: "IDX_book_chapters_chapter_number",
        columnNames: ["chapter_number"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("book_chapters");
  }
}
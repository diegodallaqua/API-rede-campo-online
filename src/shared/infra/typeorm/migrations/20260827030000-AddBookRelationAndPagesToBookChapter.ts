import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class AddBookRelationAndPagesToBookChapter20260827030000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "bookchapter",
      new TableColumn({
        name: "book_id",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "bookchapter",
      new TableForeignKey({
        name: "FK_book_chapters_book",
        columnNames: ["book_id"],
        referencedTableName: "book",
        referencedColumnNames: ["publication_id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "bookchapter",
      new TableIndex({
        name: "IDX_book_chapters_book_id",
        columnNames: ["book_id"],
      })
    );

    await queryRunner.addColumn(
      "bookchapter",
      new TableColumn({
        name: "isbn",
        type: "varchar",
        length: "50",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "bookchapter",
      new TableColumn({
        name: "start_page",
        type: "varchar",
        length: "20",
        isNullable: false,
      })
    );

    await queryRunner.addColumn(
      "bookchapter",
      new TableColumn({
        name: "end_page",
        type: "varchar",
        length: "20",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("bookchapter", "end_page");
    await queryRunner.dropColumn("bookchapter", "start_page");
    await queryRunner.dropColumn("bookchapter", "isbn");

    await queryRunner.dropForeignKey("bookchapter", "FK_book_chapters_book");
    await queryRunner.dropIndex("bookchapter", "IDX_book_chapters_book_id");
    await queryRunner.dropColumn("bookchapter", "book_id");
  }
}

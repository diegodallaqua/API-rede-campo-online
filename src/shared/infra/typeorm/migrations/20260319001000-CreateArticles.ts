import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateArticles20260311040000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "article",
        columns: [
          { name: "publication_id", type: "int", isPrimary: true, isNullable: false },
          { name: "journal_name", type: "varchar", length: "255", isNullable: false },
          { name: "volume", type: "varchar", length: "100", isNullable: true },
          { name: "issue", type: "varchar", length: "100", isNullable: true },
          { name: "pages", type: "varchar", length: "100", isNullable: true },
          { name: "publisher", type: "varchar", length: "255", isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "article",
      new TableForeignKey({
        name: "FK_articles_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "article",
      new TableIndex({ name: "IDX_articles_journal_name", columnNames: ["journal_name"] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("article");
  }
}

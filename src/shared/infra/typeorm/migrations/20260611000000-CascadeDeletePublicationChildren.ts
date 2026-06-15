import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

type FKRow = { CONSTRAINT_NAME: string };

async function getFKName(
  queryRunner: QueryRunner,
  table: string,
  column: string,
  referencedTable: string
): Promise<string | null> {
  const rows: FKRow[] = await queryRunner.query(
    `SELECT CONSTRAINT_NAME
     FROM information_schema.KEY_COLUMN_USAGE
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?
       AND REFERENCED_TABLE_NAME = ?
     LIMIT 1`,
    [table, column, referencedTable]
  );
  return rows.length > 0 ? rows[0].CONSTRAINT_NAME : null;
}

const tasks: Array<{ table: string; newFKName: string }> = [
  {
    table: "publicationhasresearcharea",
    newFKName: "FK_publication_has_research_areas_publication",
  },
  {
    table: "publicationcontributor",
    newFKName: "FK_publication_contributors_publication",
  },
  { table: "article", newFKName: "FK_articles_publication" },
  { table: "book", newFKName: "FK_books_publication" },
  { table: "bookchapter", newFKName: "FK_book_chapters_publication" },
  { table: "thesis", newFKName: "FK_thesis_publication" },
];

async function recreateFKs(
  queryRunner: QueryRunner,
  onDelete: "CASCADE" | "RESTRICT"
): Promise<void> {
  for (const t of tasks) {
    const existingName = await getFKName(
      queryRunner,
      t.table,
      "publication_id",
      "publication"
    );

    if (existingName) {
      await queryRunner.dropForeignKey(t.table, existingName);
    }

    await queryRunner.createForeignKey(
      t.table,
      new TableForeignKey({
        name: t.newFKName,
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete,
        onUpdate: "CASCADE",
      })
    );
  }
}

export class CascadeDeletePublicationChildren20260611000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await recreateFKs(queryRunner, "CASCADE");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await recreateFKs(queryRunner, "RESTRICT");
  }
}

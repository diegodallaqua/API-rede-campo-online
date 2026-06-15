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

export class CascadeDeleteMedia20260609000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tasks: Array<{
      table: string;
      column: string;
      refTable: string;
      refColumn: string;
      newFKName: string;
    }> = [
      {
        table: "newsmedia",
        column: "news_id",
        refTable: "news",
        refColumn: "id",
        newFKName: "FK_news_media_news",
      },
      {
        table: "projectmedia",
        column: "project_id",
        refTable: "project",
        refColumn: "id",
        newFKName: "FK_project_media_project",
      },
      {
        table: "eventmedia",
        column: "event_id",
        refTable: "event",
        refColumn: "id",
        newFKName: "FK_event_media_event",
      },
    ];

    for (const t of tasks) {
      const existingName = await getFKName(
        queryRunner,
        t.table,
        t.column,
        t.refTable
      );

      if (existingName) {
        await queryRunner.dropForeignKey(t.table, existingName);
      }

      await queryRunner.createForeignKey(
        t.table,
        new TableForeignKey({
          name: t.newFKName,
          columnNames: [t.column],
          referencedTableName: t.refTable,
          referencedColumnNames: [t.refColumn],
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tasks: Array<{
      table: string;
      column: string;
      refTable: string;
      refColumn: string;
      newFKName: string;
    }> = [
      {
        table: "newsmedia",
        column: "news_id",
        refTable: "news",
        refColumn: "id",
        newFKName: "FK_news_media_news",
      },
      {
        table: "projectmedia",
        column: "project_id",
        refTable: "project",
        refColumn: "id",
        newFKName: "FK_project_media_project",
      },
      {
        table: "eventmedia",
        column: "event_id",
        refTable: "event",
        refColumn: "id",
        newFKName: "FK_event_media_event",
      },
    ];

    for (const t of tasks) {
      const existingName = await getFKName(
        queryRunner,
        t.table,
        t.column,
        t.refTable
      );

      if (existingName) {
        await queryRunner.dropForeignKey(t.table, existingName);
      }

      await queryRunner.createForeignKey(
        t.table,
        new TableForeignKey({
          name: t.newFKName,
          columnNames: [t.column],
          referencedTableName: t.refTable,
          referencedColumnNames: [t.refColumn],
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        })
      );
    }
  }
}

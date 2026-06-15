import { MigrationInterface, QueryRunner } from "typeorm";

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

export class RemoveProjectIdFromNews20260609000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const fkName = await getFKName(queryRunner, "news", "project_id", "project");

    if (fkName) {
      await queryRunner.query(`ALTER TABLE news DROP FOREIGN KEY \`${fkName}\``);
    }

    const indexRows: { Key_name: string }[] = await queryRunner.query(
      `SHOW INDEX FROM news WHERE Column_name = 'project_id'`
    );

    for (const row of indexRows) {
      await queryRunner.query(`ALTER TABLE news DROP INDEX \`${row.Key_name}\``);
    }

    const columnRows: unknown[] = await queryRunner.query(
      `SELECT COLUMN_NAME
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'news'
         AND COLUMN_NAME = 'project_id'`
    );

    if (columnRows.length > 0) {
      await queryRunner.query(`ALTER TABLE news DROP COLUMN project_id`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE news ADD COLUMN project_id INT NULL AFTER id`
    );

    await queryRunner.query(
      `ALTER TABLE news ADD CONSTRAINT FK_news_project
       FOREIGN KEY (project_id) REFERENCES project(id)
       ON DELETE SET NULL ON UPDATE CASCADE`
    );

    await queryRunner.query(
      `CREATE INDEX IDX_news_project_id ON news (project_id)`
    );
  }
}

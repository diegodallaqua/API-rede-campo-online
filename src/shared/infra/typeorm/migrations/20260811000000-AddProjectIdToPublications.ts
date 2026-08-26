import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from "typeorm";

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

async function hasColumn(
  queryRunner: QueryRunner,
  table: string,
  column: string
): Promise<boolean> {
  const rows: unknown[] = await queryRunner.query(
    `SELECT COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows.length > 0;
}

export class AddProjectIdToPublications20260811000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await hasColumn(queryRunner, "publication", "project_id")) {
      return;
    }

    await queryRunner.addColumn(
      "publication",
      new TableColumn({
        name: "project_id",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createIndex(
      "publication",
      new TableIndex({
        name: "IDX_publications_project_id",
        columnNames: ["project_id"],
      })
    );

    await queryRunner.createForeignKey(
      "publication",
      new TableForeignKey({
        name: "FK_publications_project",
        columnNames: ["project_id"],
        referencedTableName: "project",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await hasColumn(queryRunner, "publication", "project_id"))) {
      return;
    }

    const fkName = await getFKName(
      queryRunner,
      "publication",
      "project_id",
      "project"
    );

    if (fkName) {
      await queryRunner.query(
        `ALTER TABLE publication DROP FOREIGN KEY \`${fkName}\``
      );
    }

    const indexRows: { Key_name: string }[] = await queryRunner.query(
      `SHOW INDEX FROM publication WHERE Column_name = 'project_id'`
    );

    for (const row of indexRows) {
      await queryRunner.query(
        `ALTER TABLE publication DROP INDEX \`${row.Key_name}\``
      );
    }

    await queryRunner.query(`ALTER TABLE publication DROP COLUMN project_id`);
  }
}

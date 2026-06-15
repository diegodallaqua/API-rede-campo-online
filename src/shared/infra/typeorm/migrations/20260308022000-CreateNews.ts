import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateNews20260308013000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "news",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "project_id", type: "int", isNullable: true },
          { name: "member_id", type: "int", isNullable: false },
          { name: "title", type: "varchar", length: "180", isNullable: false },
          { name: "description", type: "varchar", length: "1000", isNullable: false },
          { name: "content", type: "text", isNullable: false },
          { name: "publication_date", type: "date", isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "news",
      new TableForeignKey({
        name: "FK_news_project",
        columnNames: ["project_id"],
        referencedTableName: "project",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "news",
      new TableForeignKey({
        name: "FK_news_member",
        columnNames: ["member_id"],
        referencedTableName: "member",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "news",
      new TableIndex({ name: "IDX_news_project_id", columnNames: ["project_id"] })
    );

    await queryRunner.createIndex(
      "news",
      new TableIndex({ name: "IDX_news_member_id", columnNames: ["member_id"] })
    );

    await queryRunner.createIndex(
      "news",
      new TableIndex({ name: "IDX_news_publication_date", columnNames: ["publication_date"] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("news");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateNewsMedia20260308020000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "news_media",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "news_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "180",
            isNullable: false,
          },
          {
            name: "media",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "news_media",
      new TableForeignKey({
        name: "FK_news_media_news",
        columnNames: ["news_id"],
        referencedTableName: "news",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "news_media",
      new TableIndex({
        name: "IDX_news_media_news_id",
        columnNames: ["news_id"],
      })
    );

    await queryRunner.createIndex(
      "news_media",
      new TableIndex({
        name: "IDX_news_media_name",
        columnNames: ["name"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("news_media");
  }
}
import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateTokenBlacklist1780012800000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "token_blacklist",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "token_hash",
            type: "varchar",
            length: "64",
            isNullable: false,
          },
          {
            name: "expires_at",
            type: "datetime",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "token_blacklist",
      new TableIndex({
        name: "UQ_token_blacklist_token_hash",
        columnNames: ["token_hash"],
        isUnique: true,
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("token_blacklist");
  }
}

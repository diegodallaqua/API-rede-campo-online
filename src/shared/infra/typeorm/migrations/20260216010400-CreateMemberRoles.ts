import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateMemberRoles20260216010400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "memberRoles",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "120",
            isNullable: false,
            isUnique: true,
          },
        ],
      })
    );

    await queryRunner.createIndex(
      "member_roles",
      new TableIndex({
        name: "IDX_member_roles_name",
        columnNames: ["name"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("member_roles");
  }
}

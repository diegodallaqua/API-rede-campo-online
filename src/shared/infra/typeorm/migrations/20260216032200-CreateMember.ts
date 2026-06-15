import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateMembers20260216032200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "member",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "member_role_id", type: "int", isNullable: false },
          { name: "organization_id", type: "int", isNullable: false },

          { name: "name", type: "varchar", length: "160", isNullable: false },
          { name: "email", type: "varchar", length: "180", isNullable: false },
          { name: "description", type: "varchar", length: "600", isNullable: false },

          { name: "lattes_url", type: "varchar", length: "255", isNullable: true },
          { name: "linked_in_url", type: "varchar", length: "255", isNullable: true },
          { name: "profile_picture", type: "varchar", length: "255", isNullable: true },

          { name: "password", type: "varchar", length: "255", isNullable: true },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "member",
      new TableForeignKey({
        name: "FK_members_member_role",
        columnNames: ["member_role_id"],
        referencedTableName: "memberrole",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "member",
      new TableForeignKey({
        name: "FK_members_organization",
        columnNames: ["organization_id"],
        referencedTableName: "organization",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "member",
      new TableIndex({ name: "IDX_members_email_unique", columnNames: ["email"], isUnique: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("member");
  }
}

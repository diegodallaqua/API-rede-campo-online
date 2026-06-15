import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateProjectHasMembers20260311110000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "projecthasmember",
        columns: [
          { name: "project_id", type: "int", isPrimary: true, isNullable: false },
          { name: "member_id", type: "int", isPrimary: true, isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "projecthasmember",
      new TableForeignKey({
        name: "FK_project_has_members_project",
        columnNames: ["project_id"],
        referencedTableName: "project",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "projecthasmember",
      new TableForeignKey({
        name: "FK_project_has_members_member",
        columnNames: ["member_id"],
        referencedTableName: "member",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "projecthasmember",
      new TableIndex({
        name: "IDX_project_has_members_unique",
        columnNames: ["project_id", "member_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("projecthasmember");
  }
}

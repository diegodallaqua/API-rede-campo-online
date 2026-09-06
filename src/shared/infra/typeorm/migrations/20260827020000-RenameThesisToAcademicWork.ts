import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
  TableColumn,
} from "typeorm";

export class RenameThesisToAcademicWork20260827020000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("RENAME TABLE `thesis` TO `academicwork`");

    await queryRunner.dropForeignKey("academicwork", "FK_thesis_publication");
    await queryRunner.dropForeignKey("academicwork", "FK_thesis_organization");
    await queryRunner.dropIndex("academicwork", "IDX_thesis_organization_id");

    await queryRunner.createForeignKey(
      "academicwork",
      new TableForeignKey({
        name: "FK_academicwork_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "academicwork",
      new TableForeignKey({
        name: "FK_academicwork_organization",
        columnNames: ["organization_id"],
        referencedTableName: "organization",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "academicwork",
      new TableIndex({
        name: "IDX_academicwork_organization_id",
        columnNames: ["organization_id"],
      })
    );

    await queryRunner.addColumn(
      "academicwork",
      new TableColumn({
        name: "academic_work_type_id",
        type: "int",
        isNullable: false,
      })
    );

    await queryRunner.createForeignKey(
      "academicwork",
      new TableForeignKey({
        name: "FK_academicwork_academic_work_type",
        columnNames: ["academic_work_type_id"],
        referencedTableName: "academicworktype",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "academicwork",
      new TableIndex({
        name: "IDX_academicwork_academic_work_type_id",
        columnNames: ["academic_work_type_id"],
      })
    );

    await queryRunner.addColumn(
      "academicwork",
      new TableColumn({
        name: "defense_date",
        type: "date",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("academicwork", "defense_date");

    await queryRunner.dropForeignKey(
      "academicwork",
      "FK_academicwork_academic_work_type"
    );
    await queryRunner.dropIndex(
      "academicwork",
      "IDX_academicwork_academic_work_type_id"
    );
    await queryRunner.dropColumn("academicwork", "academic_work_type_id");

    await queryRunner.dropForeignKey(
      "academicwork",
      "FK_academicwork_publication"
    );
    await queryRunner.dropForeignKey(
      "academicwork",
      "FK_academicwork_organization"
    );
    await queryRunner.dropIndex(
      "academicwork",
      "IDX_academicwork_organization_id"
    );

    await queryRunner.createForeignKey(
      "academicwork",
      new TableForeignKey({
        name: "FK_thesis_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publication",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "academicwork",
      new TableForeignKey({
        name: "FK_thesis_organization",
        columnNames: ["organization_id"],
        referencedTableName: "organization",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "academicwork",
      new TableIndex({
        name: "IDX_thesis_organization_id",
        columnNames: ["organization_id"],
      })
    );

    await queryRunner.query("RENAME TABLE `academicwork` TO `thesis`");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateOrganizations20260216000245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "organizations",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "address_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "180",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "logo",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "organizations",
      new TableForeignKey({
        name: "FK_organizations_address",
        columnNames: ["address_id"],
        referencedTableName: "addresses",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "organizations",
      new TableIndex({
        name: "IDX_organizations_address_id",
        columnNames: ["address_id"],
      })
    );

    await queryRunner.createIndex(
      "organizations",
      new TableIndex({
        name: "IDX_organizations_name",
        columnNames: ["name"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("organizations");
  }
}

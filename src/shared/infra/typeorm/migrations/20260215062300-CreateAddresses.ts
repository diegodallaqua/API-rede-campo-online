import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateAddress20260215060000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "address",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "city_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "street",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "neighborhood",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "number",
            type: "int",
            isNullable: false,
          },
          {
            name: "cep",
            type: "varchar",
            length: "8",
            isNullable: false,
          },
          {
            name: "complement",
            type: "varchar",
            length: "150",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "address",
      new TableForeignKey({
        name: "FK_address_city",
        columnNames: ["city_id"],
        referencedTableName: "cities",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "address",
      new TableIndex({
        name: "IDX_address_city_id",
        columnNames: ["city_id"],
      })
    );

    await queryRunner.createIndex(
      "address",
      new TableIndex({
        name: "IDX_address_cep",
        columnNames: ["cep"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("address");
  }
}

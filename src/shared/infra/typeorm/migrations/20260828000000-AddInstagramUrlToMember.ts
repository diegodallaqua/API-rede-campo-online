import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddInstagramUrlToMember20260828000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "member",
      new TableColumn({
        name: "instagram_url",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("member", "instagram_url");
  }
}

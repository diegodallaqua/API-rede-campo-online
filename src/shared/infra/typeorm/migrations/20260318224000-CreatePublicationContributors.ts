import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreatePublicationContributors20260311030000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "publication_contributors",
        columns: [
          {
            name: "publication_id",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "author_order",
            type: "int",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "member_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "external_author_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "contributor_role_id",
            type: "int",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "publication_contributors",
      new TableForeignKey({
        name: "FK_publication_contributors_publication",
        columnNames: ["publication_id"],
        referencedTableName: "publications",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "publication_contributors",
      new TableForeignKey({
        name: "FK_publication_contributors_member",
        columnNames: ["member_id"],
        referencedTableName: "members",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "publication_contributors",
      new TableForeignKey({
        name: "FK_publication_contributors_external_author",
        columnNames: ["external_author_id"],
        referencedTableName: "external_authors",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "publication_contributors",
      new TableForeignKey({
        name: "FK_publication_contributors_contributor_role",
        columnNames: ["contributor_role_id"],
        referencedTableName: "contributor_roles",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createIndex(
      "publication_contributors",
      new TableIndex({
        name: "IDX_publication_contributors_publication_author_order_unique",
        columnNames: ["publication_id", "author_order"],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      "publication_contributors",
      new TableIndex({
        name: "IDX_publication_contributors_publication_member_role_unique",
        columnNames: ["publication_id", "member_id", "contributor_role_id"],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      "publication_contributors",
      new TableIndex({
        name: "IDX_publication_contributors_publication_external_role_unique",
        columnNames: ["publication_id", "external_author_id", "contributor_role_id"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("publication_contributors");
  }
}
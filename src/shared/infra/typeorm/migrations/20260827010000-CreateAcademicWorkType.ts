import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAcademicWorkType20260827010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "academicworktype",
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
          },
          {
            name: "degree_level",
            type: "varchar",
            length: "120",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.query(
      "INSERT INTO `academicworktype` (`id`, `name`, `degree_level`) VALUES " +
        "(1, 'Trabalho de Conclusão de Curso', 'Graduação'), " +
        "(2, 'Monografia', 'Especialização'), " +
        "(3, 'Dissertação', 'Mestrado'), " +
        "(4, 'Tese', 'Doutorado'), " +
        "(5, 'Tese', 'Livre-docência'), " +
        "(6, 'Relatório', 'Pós-doutorado')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("academicworktype");
  }
}

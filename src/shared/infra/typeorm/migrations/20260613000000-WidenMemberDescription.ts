import { MigrationInterface, QueryRunner } from "typeorm";

export class WidenMemberDescription20260613000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE member MODIFY COLUMN description VARCHAR(2000) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE member MODIFY COLUMN description VARCHAR(600) NOT NULL`
    );
  }
}

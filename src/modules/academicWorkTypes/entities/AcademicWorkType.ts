import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("academicworktype")
export class AcademicWorkType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 120 })
  degree_level!: string;
}

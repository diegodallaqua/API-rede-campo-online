import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("projecttype")
@Index(["name"], { unique: true })
export class ProjectType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string;
}

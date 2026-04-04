import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("researcharea")
@Index(["name"], { unique: true })
export class ResearchArea {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string;
}

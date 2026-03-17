import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("contributorrole")
@Index(["name"], { unique: true })
export class ContributorRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string;
}

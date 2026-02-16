import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("memberrole")
@Index(["name"], { unique: true })
export class MemberRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  name!: string;
}

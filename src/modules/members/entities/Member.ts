import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { MemberRole } from "../../memberRoles/entities/MemberRole";
import { Organization } from "../../organizations/entities/Organization";

@Entity("member")
@Index(["cpf"], { unique: true })
@Index(["email"], { unique: true })
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  member_role_id!: number;

  @ManyToOne(() => MemberRole, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "member_role_id" })
  memberRole!: MemberRole;

  @Column({ type: "int" })
  organization_id!: number;

  @ManyToOne(() => Organization, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @Column({ type: "varchar", length: 160 })
  name!: string;

  @Column({ type: "varchar", length: 180 })
  email!: string;

  @Column({ type: "varchar", length: 11, unique: true })
  cpf!: string;

  @Column({ type: "varchar", length: 600 })
  description!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  lattes_url?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  linked_in_url?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  profile_picture?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, select: false })
  password?: string | null;
}

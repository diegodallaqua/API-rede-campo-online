import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Project } from "../../projects/entities/Project";
import { Member } from "../../members/entities/Member";

@Entity("news")
@Index(["project_id"])
@Index(["member_id"])
@Index(["publication_date"])
export class News {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", nullable: true })
  project_id?: number | null;

  @ManyToOne(() => Project, { onDelete: "SET NULL", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: "project_id" })
  project?: Project | null;

  @Column({ type: "int" })
  member_id!: number;

  @ManyToOne(() => Member, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member!: Member;

  @Column({ type: "varchar", length: 180 })
  title!: string;

  @Column({ type: "varchar", length: 1000 })
  description!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "date" })
  publication_date!: Date;
}
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Project } from "../../projects/entities/Project";

@Entity("publication")
@Index(["title"])
@Index(["doi"], { unique: true })
@Index(["project_id"])
export class Publication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 2000 })
  abstract!: string;

  @Column({ type: "date" })
  publication_date!: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  doi?: string | null;

  @Column({ type: "int", nullable: true })
  project_id?: number | null;

  @ManyToOne(() => Project, { onDelete: "SET NULL", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: "project_id" })
  project?: Project | null;
}

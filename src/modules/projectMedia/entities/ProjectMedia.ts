import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Project } from "../../projects/entities/Project";

@Entity("projectmedia")
@Index(["project_id"])
export class ProjectMedia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  project_id!: number;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  media!: string;
}
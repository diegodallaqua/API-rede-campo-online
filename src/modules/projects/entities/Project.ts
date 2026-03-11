import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { ProjectType } from "../../projectTypes/entities/ProjectType";

@Entity("project")
@Index(["project_type_id"])
@Index(["name"])
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  project_type_id!: number;

  @ManyToOne(() => ProjectType, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_type_id" })
  projectType!: ProjectType;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "varchar", length: 1000 })
  description!: string;

  @Column({ type: "boolean" })
  status!: boolean;

  @Column({ type: "date" })
  begin_date!: string;

  @Column({ type: "date", nullable: true })
  end_date?: string | null;

}
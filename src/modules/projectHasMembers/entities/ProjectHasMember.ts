import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Project } from "../../projects/entities/Project";
import { Member } from "../../members/entities/Member";

@Entity("projecthasmember")
@Index(["project_id", "member_id"], { unique: true })
export class ProjectHasMember {
  @PrimaryColumn({ type: "int" })
  project_id!: number;

  @PrimaryColumn({ type: "int" })
  member_id!: number;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => Member, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member!: Member;
}
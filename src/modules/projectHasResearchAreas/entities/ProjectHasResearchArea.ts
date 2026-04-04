import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Project } from "../../projects/entities/Project";
import { ResearchArea } from "../../researchAreas/entities/ResearchArea";

@Entity("projecthasresearcharea")
@Index(["project_id", "research_area_id"], { unique: true })
export class ProjectHasResearchArea {
  @PrimaryColumn({ type: "int" })
  project_id!: number;

  @PrimaryColumn({ type: "int" })
  research_area_id!: number;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => ResearchArea, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "research_area_id" })
  researchArea!: ResearchArea;
}
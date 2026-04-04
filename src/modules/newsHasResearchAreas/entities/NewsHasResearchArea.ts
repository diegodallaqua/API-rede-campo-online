import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { News } from "../../news/entities/News";
import { ResearchArea } from "../../researchAreas/entities/ResearchArea";

@Entity("newshasresearcharea")
@Index(["research_area_id", "news_id"], { unique: true })
export class NewsHasResearchArea {
  @PrimaryColumn({ type: "int" })
  research_area_id!: number;

  @PrimaryColumn({ type: "int" })
  news_id!: number;

  @ManyToOne(() => ResearchArea, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "research_area_id" })
  researchArea!: ResearchArea;

  @ManyToOne(() => News, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "news_id" })
  news!: News;
}
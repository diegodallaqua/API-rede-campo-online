import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Publication } from "../../publications/entities/Publication";
import { ResearchArea } from "../../researchAreas/entities/ResearchArea";

@Entity("publicationhasresearcharea")
@Index(["publication_id", "research_area_id"], { unique: true })
export class PublicationHasResearchArea {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @PrimaryColumn({ type: "int" })
  research_area_id!: number;

  @ManyToOne(() => Publication, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @ManyToOne(() => ResearchArea, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "research_area_id" })
  researchArea!: ResearchArea;
}
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { News } from "../../news/entities/News";

@Entity("newsmedia")
@Index(["news_id"])
export class NewsMedia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  news_id!: number;

  @ManyToOne(() => News, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "news_id" })
  news!: News;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  media!: string;
}
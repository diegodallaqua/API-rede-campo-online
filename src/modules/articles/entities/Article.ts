import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Publication } from "../../publications/entities/Publication";

@Entity("article")
@Index(["journal_name"])
export class Article {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @OneToOne(() => Publication, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "varchar", length: 255 })
  journal_name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  volume?: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  issue?: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  pages?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  publisher?: string | null;
}
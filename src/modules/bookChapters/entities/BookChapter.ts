import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Publication } from "../../publications/entities/Publication";

@Entity("bookchapter")
@Index(["book_name"])
@Index(["chapter_number"])
export class BookChapter {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @OneToOne(() => Publication, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "varchar", length: 255 })
  book_name!: string;

  @Column({ type: "int" })
  chapter_number!: number;
}
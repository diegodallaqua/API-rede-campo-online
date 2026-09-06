import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Publication } from "../../publications/entities/Publication";
import { Book } from "../../books/entities/Book";

@Entity("bookchapter")
@Index(["book_name"])
@Index(["chapter_number"])
@Index(["book_id"])
export class BookChapter {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @OneToOne(() => Publication, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "int", nullable: true })
  book_id?: number | null;

  @ManyToOne(() => Book, { onDelete: "SET NULL", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: "book_id" })
  book?: Book | null;

  @Column({ type: "varchar", length: 255 })
  book_name!: string;

  @Column({ type: "int" })
  chapter_number!: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  isbn?: string | null;

  @Column({ type: "varchar", length: 20 })
  start_page!: string;

  @Column({ type: "varchar", length: 20 })
  end_page!: string;
}

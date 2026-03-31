import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Publication } from "../../publications/entities/Publication";

@Entity("book")
@Index(["publisher"])
@Index(["edition"])
export class Book {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @OneToOne(() => Publication, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "varchar", length: 255 })
  publisher!: string;

  @Column({ type: "varchar", length: 100 })
  edition!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  cover_photo?: string | null;
}
import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("publication")
@Index(["title"])
@Index(["doi"], { unique: true })
export class Publication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 2000 })
  abstract!: string;

  @Column({ type: "date" })
  publication_date!: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  doi?: string | null;
}
    import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("externalauthor")
@Index(["name"])
@Index(["email"])
@Index(["orcid"])
export class ExternalAuthor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "varchar", length: 180, nullable: true })
  email?: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  orcid?: string | null;
}
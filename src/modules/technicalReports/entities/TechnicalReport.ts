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
import { Organization } from "../../organizations/entities/Organization";

@Entity("technicalreport")
@Index(["organization_id"])
export class TechnicalReport {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @OneToOne(() => Publication, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "int" })
  organization_id!: number;

  @ManyToOne(() => Organization, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @Column({ type: "int" })
  number_of_pages!: number;
}
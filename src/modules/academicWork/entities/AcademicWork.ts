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
import { AcademicWorkType } from "../../academicWorkTypes/entities/AcademicWorkType";

@Entity("academicwork")
@Index(["organization_id"])
@Index(["academic_work_type_id"])
export class AcademicWork {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @OneToOne(() => Publication, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "int" })
  organization_id!: number;

  @ManyToOne(() => Organization, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;

  @Column({ type: "int" })
  academic_work_type_id!: number;

  @ManyToOne(() => AcademicWorkType, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "academic_work_type_id" })
  academic_work_type!: AcademicWorkType;

  @Column({ type: "date" })
  defense_date!: string;

  @Column({ type: "int" })
  number_of_pages!: number;
}

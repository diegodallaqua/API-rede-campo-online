import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Index,
} from "typeorm";
import { Publication } from "../../publications/entities/Publication";
import { Member } from "../../members/entities/Member";
import { ExternalAuthor } from "../../externalAuthors/entities/ExternalAuthor";
import { ContributorRole } from "../../contributorRoles/entities/ContributorRole";

@Entity("publicationcontributor")
@Index(["publication_id", "author_order"], { unique: true })
@Index(["publication_id", "member_id", "contributor_role_id"], { unique: true })
@Index(["publication_id", "external_author_id", "contributor_role_id"], { unique: true })
export class PublicationContributor {
  @PrimaryColumn({ type: "int" })
  publication_id!: number;

  @PrimaryColumn({ type: "int" })
  author_order!: number;

  @ManyToOne(() => Publication, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "publication_id" })
  publication!: Publication;

  @Column({ type: "int", nullable: true })
  member_id?: number | null;

  @ManyToOne(() => Member, { onDelete: "RESTRICT", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: "member_id" })
  member?: Member | null;

  @Column({ type: "int", nullable: true })
  external_author_id?: number | null;

  @ManyToOne(() => ExternalAuthor, { onDelete: "RESTRICT", onUpdate: "CASCADE", nullable: true })
  @JoinColumn({ name: "external_author_id" })
  externalAuthor?: ExternalAuthor | null;

  @Column({ type: "int" })
  contributor_role_id!: number;

  @ManyToOne(() => ContributorRole, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "contributor_role_id" })
  contributorRole!: ContributorRole;
}
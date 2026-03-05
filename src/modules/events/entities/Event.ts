import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Address } from "../../addresses/entities/Address";
import { Project } from "../../projects/entities/Project";

@Entity("event")
@Index(["project_id"])
@Index(["address_id"])
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  address_id!: number;

  @ManyToOne(() => Address, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "address_id" })
  address!: Address;

  @Column({ type: "int" })
  project_id!: number;

  @ManyToOne(() => Project, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "timestamp" })
  date!: Date;

  @Column({ type: "varchar", length: 1000, nullable: true })
  description?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  registration_url?: string | null;
}
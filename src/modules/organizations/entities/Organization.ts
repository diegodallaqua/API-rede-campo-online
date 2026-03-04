import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Address } from "../../addresses/entities/Address";

@Entity("organization")
@Index(["name"], { unique: false })
@Index(["address_id"])
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  address_id!: number;

  @ManyToOne(() => Address, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "address_id" })
  address!: Address;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  logo!: string;
}

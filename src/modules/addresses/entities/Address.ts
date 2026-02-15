import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { City } from "../../cities/entities/City";

@Entity("address")
@Index(["city_id"])
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  city_id!: number;

  @ManyToOne(() => City, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "city_id" })
  city!: City;

  @Column({ type: "varchar", length: 150 })
  street!: string;

  @Column({ type: "varchar", length: 150 })
  neighborhood!: string;

  @Column({ type: "int" })
  number!: number;

  @Column({ type: "varchar", length: 8 })
  cep!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  complement?: string;
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { State } from "../../states/entities/State";

@Entity("city")
@Index(["state_id", "name"], { unique: true })
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  state_id!: number;

  @ManyToOne(() => State, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "state_id" })
  state!: State;

  @Column({ type: "varchar", length: 120 })
  name!: string;
}
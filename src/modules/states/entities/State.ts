import { Column, Entity, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("states")
export class State {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 120 })
  name!: string;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { Event } from "../../events/entities/Event";

@Entity("eventmedia")
@Index(["event_id"])
export class EventMedia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  event_id!: number;

  @ManyToOne(() => Event, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: Event;

  @Column({ type: "varchar", length: 180 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  media!: string;
}
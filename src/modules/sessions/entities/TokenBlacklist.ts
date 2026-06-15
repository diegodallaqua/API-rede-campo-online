import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("token_blacklist")
@Index(["token_hash"], { unique: true })
export class TokenBlacklist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 64 })
  token_hash!: string;

  @Column({ type: "datetime" })
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}

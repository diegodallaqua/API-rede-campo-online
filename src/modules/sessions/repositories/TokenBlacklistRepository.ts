import { createHash } from "crypto";
import { LessThan, Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { TokenBlacklist } from "../entities/TokenBlacklist";
import { ITokenBlacklistRepository } from "./ITokenBlacklistRepository";

export class TokenBlacklistRepository implements ITokenBlacklistRepository {
  private ormRepo: Repository<TokenBlacklist>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(TokenBlacklist);
  }

  private hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  async add(token: string, expiresAt: Date): Promise<void> {
    const entity = this.ormRepo.create({ token_hash: this.hash(token), expires_at: expiresAt });
    await this.ormRepo.save(entity);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { token_hash: this.hash(token) } });
    return count > 0;
  }

  async deleteExpired(): Promise<void> {
    await this.ormRepo.delete({ expires_at: LessThan(new Date()) });
  }
}

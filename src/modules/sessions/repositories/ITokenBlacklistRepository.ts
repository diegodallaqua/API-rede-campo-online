export interface ITokenBlacklistRepository {
  add(token: string, expiresAt: Date): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
  deleteExpired(): Promise<void>;
}

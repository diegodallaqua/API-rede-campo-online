import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { ITokenBlacklistRepository } from "../repositories/ITokenBlacklistRepository";

type IRequest = {
  token: string;
};

@injectable()
export class LogoutUseCase {
  constructor(
    @inject("TokenBlacklistRepository")
    private tokenBlacklistRepository: ITokenBlacklistRepository
  ) {}

  async execute({ token }: IRequest): Promise<void> {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.tokenBlacklistRepository.add(token, expiresAt);
    await this.tokenBlacklistRepository.deleteExpired();
  }
}

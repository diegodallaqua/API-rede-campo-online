import { container } from "tsyringe";
import { ITokenBlacklistRepository } from "../repositories/ITokenBlacklistRepository";
import { TokenBlacklistRepository } from "../repositories/TokenBlacklistRepository";

container.registerSingleton<ITokenBlacklistRepository>(
  "TokenBlacklistRepository",
  TokenBlacklistRepository
);

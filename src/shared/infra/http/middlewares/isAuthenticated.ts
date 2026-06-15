import { createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import { authConfig } from "../../../../config/auth";
import { AppDataSource } from "../../database/data-source";
import { TokenBlacklist } from "../../../../modules/sessions/entities/TokenBlacklist";

type TokenPayload = {
  sub: string;
  role_id?: number;
  organization_id?: number;
};

export async function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError("JWT token missing", 401, "TOKEN_MISSING");
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    throw new AppError("JWT token missing", 401, "TOKEN_MISSING");
  }

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;
  } catch {
    throw new AppError("Invalid JWT token", 401, "TOKEN_INVALID");
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const blacklisted = await AppDataSource.getRepository(TokenBlacklist).count({
    where: { token_hash: tokenHash },
  });
  if (blacklisted > 0) {
    throw new AppError("Invalid JWT token", 401, "TOKEN_INVALID");
  }

  (req as any).user = {
    id: Number(decoded.sub),
    role_id: decoded.role_id,
    organization_id: decoded.organization_id,
  };

  return next();
}

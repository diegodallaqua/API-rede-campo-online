import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import { authConfig } from "../../../../config/auth";

type TokenPayload = {
  sub: string;
  role_id?: number;
  organization_id?: number;
};

export function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError("JWT token missing", 401, "TOKEN_MISSING");
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    throw new AppError("JWT token missing", 401, "TOKEN_MISSING");
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    (req as any).user = {
      id: Number(decoded.sub),
      role_id: decoded.role_id,
      organization_id: decoded.organization_id,
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT token", 401, "TOKEN_INVALID");
  }
}

import { isCelebrateError } from "celebrate";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Validação (celebrate/joi)
  if (isCelebrateError(err)) {
    const details: Record<string, string> = {};

    for (const [segment, joiError] of err.details.entries()) {
      details[segment] = joiError.details.map((d) => d.message).join(", ");
    }

    return res.status(400).json({
      message: "Validation error",
      details
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code
    });
  }

  // Erro inesperado
  const isProd = process.env.NODE_ENV === "production";

  console.error("[ErrorHandler]", err);
  
  return res.status(500).json({
    message: "Internal server error",
    ...(isProd ? {} : { stack: err.stack })
  });
}

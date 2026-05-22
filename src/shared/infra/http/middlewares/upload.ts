import { RequestHandler } from "express";
import multer from "multer";
import { AppError } from "../../../errors/AppError";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          "Only JPEG, PNG and WebP images are allowed",
          415,
          "INVALID_MIME_TYPE"
        )
      );
    }
    cb(null, true);
  },
});

/**
 * Returns an Express middleware that parses a single uploaded file from the
 * given field name. Converts multer-specific errors (e.g. LIMIT_FILE_SIZE)
 * into AppErrors so they are handled by the global errorHandler.
 */
export function uploadMiddleware(fieldName: string): RequestHandler {
  const handler = multerInstance.single(fieldName);

  return (req, res, next) => {
    handler(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            new AppError("File too large. Maximum size is 10 MB", 413, "FILE_TOO_LARGE")
          );
        }
        return next(new AppError(err.message, 400, "UPLOAD_ERROR"));
      }

      // Pass through AppError thrown from fileFilter or any other error
      return next(err);
    });
  };
}

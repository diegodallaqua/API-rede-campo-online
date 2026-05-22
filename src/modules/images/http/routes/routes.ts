import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";
import { uploadMiddleware } from "../../../../shared/infra/http/middlewares/upload";

import { UploadImageController } from "../controllers/UploadImageController";

export const imagesRoutes = Router();

const uploadController = new UploadImageController();

// All routes require a valid JWT
imagesRoutes.use(isAuthenticated);

imagesRoutes.post(
  "/upload",
  uploadMiddleware("file"),
  celebrate({
    [Segments.BODY]: Joi.object({
      entityType: Joi.string().trim().valid("event", "news", "project").required(),
      entityId: Joi.string().trim().min(1).max(36).required(),
    }),
  }),
  uploadController.handle
);

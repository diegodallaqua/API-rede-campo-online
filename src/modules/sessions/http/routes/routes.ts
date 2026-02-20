import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { SessionsController } from "../controllers/SessionsController";

export const sessionsRoutes = Router();

const controller = new SessionsController();

sessionsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().trim().email().max(180).required(),
      password: Joi.string().min(8).max(100).required(),
    }),
  }),
  controller.handle
);

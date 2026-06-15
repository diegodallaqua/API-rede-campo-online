import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { SessionsController } from "../controllers/SessionsController";
import { LogoutController } from "../controllers/LogoutController";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

export const sessionsRoutes = Router();

const sessionsController = new SessionsController();
const logoutController = new LogoutController();

sessionsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().trim().email().max(180).required(),
      password: Joi.string().min(8).max(100).required(),
    }),
  }),
  sessionsController.handle
);

sessionsRoutes.delete("/", isAuthenticated, logoutController.handle);

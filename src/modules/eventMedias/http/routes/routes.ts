import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateEventMediaController } from "../controllers/CreateEventMediaController";
import { ListEventMediaController } from "../controllers/ListEventMediaController";
import { UpdateEventMediaController } from "../controllers/UpdateEventMediaController";
import { DeleteEventMediaController } from "../controllers/DeleteEventMediaController";

export const eventMediaRoutes = Router();

const createController = new CreateEventMediaController();
const listController = new ListEventMediaController();
const updateController = new UpdateEventMediaController();
const deleteController = new DeleteEventMediaController();

eventMediaRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      event_id: Joi.number().integer().positive().optional(),
      search: Joi.string().trim().min(1).max(180).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

eventMediaRoutes.use(isAuthenticated);

eventMediaRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      event_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      media: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  createController.handle
);

eventMediaRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      event_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      media: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  updateController.handle
);

eventMediaRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
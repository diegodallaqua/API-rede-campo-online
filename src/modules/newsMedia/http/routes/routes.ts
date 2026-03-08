import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateNewsMediaController } from "../controllers/CreateNewsMediaController";
import { ListNewsMediaController } from "../controllers/ListNewsMediaController";
import { UpdateNewsMediaController } from "../controllers/UpdateNewsMediaController";
import { DeleteNewsMediaController } from "../controllers/DeleteNewsMediaController";

export const newsMediaRoutes = Router();

const createController = new CreateNewsMediaController();
const listController = new ListNewsMediaController();
const updateController = new UpdateNewsMediaController();
const deleteController = new DeleteNewsMediaController();

newsMediaRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      news_id: Joi.number().integer().positive().optional(),
      search: Joi.string().trim().min(1).max(255).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

newsMediaRoutes.use(isAuthenticated);

newsMediaRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      news_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      media: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  createController.handle
);

newsMediaRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      news_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      media: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  updateController.handle
);

newsMediaRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
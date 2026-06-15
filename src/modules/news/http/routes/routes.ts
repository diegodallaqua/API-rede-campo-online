import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateNewsController } from "../controllers/CreateNewsController";
import { ListNewsController } from "../controllers/ListNewsController";
import { UpdateNewsController } from "../controllers/UpdateNewsController";
import { DeleteNewsController } from "../controllers/DeleteNewsController";

export const newsRoutes = Router();

const createController = new CreateNewsController();
const listController = new ListNewsController();
const updateController = new UpdateNewsController();
const deleteController = new DeleteNewsController();

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

newsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(255).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

newsRoutes.use(isAuthenticated);

newsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      member_id: Joi.number().integer().positive().required(),
      title: Joi.string().trim().min(2).max(180).required(),
      description: Joi.string().trim().min(2).max(1000).required(),
      content: Joi.string().trim().min(2).required(),
      publication_date: Joi.string().pattern(isoDate).required(),
      research_area_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
    }),
  }),
  createController.handle
);

newsRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      member_id: Joi.number().integer().positive().required(),
      title: Joi.string().trim().min(2).max(180).required(),
      description: Joi.string().trim().min(2).max(1000).required(),
      content: Joi.string().trim().min(2).required(),
      publication_date: Joi.string().pattern(isoDate).required(),
      research_area_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
    }),
  }),
  updateController.handle
);

newsRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { ListProjectTypesController } from "../controllers/ListProjectTypesController";

export const projectTypesRoutes = Router();

const listController = new ListProjectTypesController();

projectTypesRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(120).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

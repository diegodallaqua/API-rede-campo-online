import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { ListAcademicWorkTypesController } from "../controllers/ListAcademicWorkTypesController";

export const academicWorkTypesRoutes = Router();

const listController = new ListAcademicWorkTypesController();

academicWorkTypesRoutes.get(
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

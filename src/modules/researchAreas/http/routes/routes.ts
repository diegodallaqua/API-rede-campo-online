import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { ListResearchAreasController } from "../controllers/ListResearchAreasController";

export const researchAreasRoutes = Router();

const listController = new ListResearchAreasController();

researchAreasRoutes.get(
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

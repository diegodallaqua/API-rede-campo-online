import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { ListContributorRolesController } from "../controllers/ListContributorRolesController";

export const contributorRolesRoutes = Router();

const listController = new ListContributorRolesController();

contributorRolesRoutes.get(
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

import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";


import { CreatePublicationController } from "../controllers/CreatePublicationController";
import { ListPublicationsController } from "../controllers/ListPublicationsController";
import { UpdatePublicationController } from "../controllers/UpdatePublicationController";
import { DeletePublicationController } from "../controllers/DeletePublicationController";

export const publicationsRoutes = Router();

const createController = new CreatePublicationController();
const listController = new ListPublicationsController();
const updateController = new UpdatePublicationController();
const deleteController = new DeletePublicationController();

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

publicationsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      title: Joi.string().trim().min(1).max(255).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

publicationsRoutes.use(isAuthenticated);

publicationsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().trim().min(2).max(255).required(),
      abstract: Joi.string().trim().min(2).max(2000).required(),
      publication_date: Joi.string().pattern(isoDate).required(),
      doi: Joi.string().trim().max(255).optional().allow(null, ""),
      research_area_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
    }),
  }),
  createController.handle
);

publicationsRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      title: Joi.string().trim().min(2).max(255).required(),
      abstract: Joi.string().trim().min(2).max(2000).required(),
      publication_date: Joi.string().pattern(isoDate).required(),
      doi: Joi.string().trim().max(255).optional().allow(null, ""),
      research_area_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
    }),
  }),
  updateController.handle
);

publicationsRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
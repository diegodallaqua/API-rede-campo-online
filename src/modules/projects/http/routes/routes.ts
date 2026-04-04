import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateProjectController } from "../controllers/CreateProjectController";
import { ListProjectsController } from "../controllers/ListProjectsController";
import { UpdateProjectController } from "../controllers/UpdateProjectController";
import { DeleteProjectController } from "../controllers/DeleteProjectController";

export const projectsRoutes = Router();

const createController = new CreateProjectController();
const listController = new ListProjectsController();
const updateController = new UpdateProjectController();
const deleteController = new DeleteProjectController();

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

projectsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      project_name: Joi.string().trim().min(1).max(180).optional(),
      status: Joi.boolean().optional(),

      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

projectsRoutes.use(isAuthenticated);

projectsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      project_type_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      description: Joi.string().trim().min(2).max(1000).required(),
      status: Joi.boolean().required(),
      begin_date: Joi.string().pattern(isoDate).required(),
      end_date: Joi.string().pattern(isoDate).optional().allow(null, ""),
      research_area_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
      member_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
    }),
  }),
  createController.handle
);

projectsRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      project_type_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      description: Joi.string().trim().min(2).max(1000).required(),
      status: Joi.boolean().required(),
      begin_date: Joi.string().pattern(isoDate).required(),
      end_date: Joi.string().pattern(isoDate).optional().allow(null, ""),
      research_area_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
      member_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .optional()
        .default([]),
    }),
  }),
  updateController.handle
);

projectsRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
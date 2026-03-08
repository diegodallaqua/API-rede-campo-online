import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateProjectMediaController } from "../controllers/CreateProjectMediaController";
import { ListProjectMediaController } from "../controllers/ListProjectMediaController";
import { UpdateProjectMediaController } from "../controllers/UpdateProjectMediaController";
import { DeleteProjectMediaController } from "../controllers/DeleteProjectMediaController";

export const projectMediaRoutes = Router();

const createController = new CreateProjectMediaController();
const listController = new ListProjectMediaController();
const updateController = new UpdateProjectMediaController();
const deleteController = new DeleteProjectMediaController();

projectMediaRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      project_id: Joi.number().integer().positive().optional(),
      search: Joi.string().trim().min(1).max(180).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

projectMediaRoutes.use(isAuthenticated);

projectMediaRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      project_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      media: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  createController.handle
);

projectMediaRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      project_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      media: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  updateController.handle
);

projectMediaRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
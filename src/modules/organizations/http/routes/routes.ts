import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateOrganizationController } from "../controllers/CreateOrganizationController";
import { ListOrganizationsController } from "../controllers/ListOrganizationsController";
import { UpdateOrganizationController } from "../controllers/UpdateOrganizationController";
import { DeleteOrganizationController } from "../controllers/DeleteOrganizationController";

export const organizationsRoutes = Router();

const createController = new CreateOrganizationController();
const listController = new ListOrganizationsController();
const updateController = new UpdateOrganizationController();
const deleteController = new DeleteOrganizationController();

organizationsRoutes.use(isAuthenticated);

organizationsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(180).optional(),
      address_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

organizationsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      address_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      logo: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  createController.handle
);

organizationsRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      address_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      logo: Joi.string().trim().min(2).max(255).required(),
    }),
  }),
  updateController.handle
);

organizationsRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);

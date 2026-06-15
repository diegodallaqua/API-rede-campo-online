import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateThesisController } from "../controllers/CreateThesisController";
import { ListThesisController } from "../controllers/ListThesisController";
import { UpdateThesisController } from "../controllers/UpdateThesisController";
import { DeleteThesisController } from "../controllers/DeleteThesisController";

export const thesisRoutes = Router();

const createController = new CreateThesisController();
const listController = new ListThesisController();
const updateController = new UpdateThesisController();
const deleteController = new DeleteThesisController();

thesisRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      title: Joi.string().trim().min(1).max(255).optional(),
      organization_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

thesisRoutes.use(isAuthenticated);

thesisRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      organization_id: Joi.number().integer().positive().required(),
      number_of_pages: Joi.number().integer().positive().required(),
    }),
  }),
  createController.handle
);

thesisRoutes.put(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      organization_id: Joi.number().integer().positive().required(),
      number_of_pages: Joi.number().integer().positive().required(),
    }),
  }),
  updateController.handle
);

thesisRoutes.delete(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);

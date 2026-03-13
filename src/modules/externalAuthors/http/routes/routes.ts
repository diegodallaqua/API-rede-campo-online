import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateExternalAuthorController } from "../controllers/CreateExternalAuthorController";
import { ListExternalAuthorsController } from "../controllers/ListExternalAuthorsController";
import { UpdateExternalAuthorController } from "../controllers/UpdateExternalAuthorController";
import { DeleteExternalAuthorController } from "../controllers/DeleteExternalAuthorController";

export const externalAuthorsRoutes = Router();

const createController = new CreateExternalAuthorController();
const listController = new ListExternalAuthorsController();
const updateController = new UpdateExternalAuthorController();
const deleteController = new DeleteExternalAuthorController();


externalAuthorsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      name: Joi.string().trim().min(1).max(180).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

externalAuthorsRoutes.use(isAuthenticated);

externalAuthorsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().trim().min(2).max(180).required(),
      email: Joi.string().trim().email().max(180).optional().allow(null, ""),
      orcid: Joi.string().trim().max(50).optional().allow(null, ""),
    }),
  }),
  createController.handle
);

externalAuthorsRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().trim().min(2).max(180).required(),
      email: Joi.string().trim().email().max(180).optional().allow(null, ""),
      orcid: Joi.string().trim().max(50).optional().allow(null, ""),
    }),
  }),
  updateController.handle
);

externalAuthorsRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
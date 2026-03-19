import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateTechnicalReportController } from "../controllers/CreateTechnicalReportController";
import { ListTechnicalReportsController } from "../controllers/ListTechnicalReportsController";
import { UpdateTechnicalReportController } from "../controllers/UpdateTechnicalReportController";
import { DeleteTechnicalReportController } from "../controllers/DeleteTechnicalReportController";

export const technicalReportsRoutes = Router();

const createController = new CreateTechnicalReportController();
const listController = new ListTechnicalReportsController();
const updateController = new UpdateTechnicalReportController();
const deleteController = new DeleteTechnicalReportController();

technicalReportsRoutes.get(
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

technicalReportsRoutes.use(isAuthenticated);

technicalReportsRoutes.post(
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

technicalReportsRoutes.put(
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

technicalReportsRoutes.delete(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
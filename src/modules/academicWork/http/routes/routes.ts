import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateAcademicWorkController } from "../controllers/CreateAcademicWorkController";
import { ListAcademicWorkController } from "../controllers/ListAcademicWorkController";
import { UpdateAcademicWorkController } from "../controllers/UpdateAcademicWorkController";
import { DeleteAcademicWorkController } from "../controllers/DeleteAcademicWorkController";

export const academicWorkRoutes = Router();

const createController = new CreateAcademicWorkController();
const listController = new ListAcademicWorkController();
const updateController = new UpdateAcademicWorkController();
const deleteController = new DeleteAcademicWorkController();

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

academicWorkRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      title: Joi.string().trim().min(1).max(255).optional(),
      organization_id: Joi.number().integer().positive().optional(),
      academic_work_type_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

academicWorkRoutes.use(isAuthenticated);

academicWorkRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      organization_id: Joi.number().integer().positive().required(),
      academic_work_type_id: Joi.number().integer().positive().required(),
      defense_date: Joi.string().pattern(isoDate).required(),
      number_of_pages: Joi.number().integer().positive().required(),
    }),
  }),
  createController.handle
);

academicWorkRoutes.put(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      organization_id: Joi.number().integer().positive().required(),
      academic_work_type_id: Joi.number().integer().positive().required(),
      defense_date: Joi.string().pattern(isoDate).required(),
      number_of_pages: Joi.number().integer().positive().required(),
    }),
  }),
  updateController.handle
);

academicWorkRoutes.delete(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);

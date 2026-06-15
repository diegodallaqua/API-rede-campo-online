import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { CreateEventController } from "../controllers/CreateEventController";
import { ListEventsController } from "../controllers/ListEventsController";
import { UpdateEventController } from "../controllers/UpdateEventController";
import { DeleteEventController } from "../controllers/DeleteEventController";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

export const eventsRoutes = Router();

const createController = new CreateEventController();
const listController = new ListEventsController();
const updateController = new UpdateEventController();
const deleteController = new DeleteEventController();

eventsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      project_id: Joi.number().integer().positive().optional(),
      search: Joi.string().trim().min(1).max(180).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
      date_from: Joi.string().isoDate().optional(),
      date_to: Joi.string().isoDate().optional(),
    }),
  }),
  listController.handle
);

eventsRoutes.use(isAuthenticated);

eventsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      address_id: Joi.number().integer().positive().required(),
      project_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      date: Joi.date().iso().required(), // ISO 8601
      description: Joi.string().trim().max(1000).optional().allow(null, ""),
      registration_url: Joi.string().trim().max(255).optional().allow(null, ""),
    }),
  }),
  createController.handle
);

eventsRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      address_id: Joi.number().integer().positive().required(),
      project_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(180).required(),
      date: Joi.date().iso().required(),
      description: Joi.string().trim().max(1000).optional().allow(null, ""),
      registration_url: Joi.string().trim().max(255).optional().allow(null, ""),
    }),
  }),
  updateController.handle
);

eventsRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
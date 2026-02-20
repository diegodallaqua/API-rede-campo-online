import { Router } from "express";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";
import { celebrate, Joi, Segments } from "celebrate";

import { CreateCityController } from "../controllers/CreateCityController";
import { ListCitiesController } from "../controllers/ListCitiesController";
import { UpdateCityController } from "../controllers/UpdateCityController";
import { DeleteCityController } from "../controllers/DeleteCityController";

export const citiesRoutes = Router();

const createController = new CreateCityController();
const listController = new ListCitiesController();
const updateController = new UpdateCityController();
const deleteController = new DeleteCityController();

citiesRoutes.get("/", listController.handle);

citiesRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(120).optional(),
      state_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

citiesRoutes.use(isAuthenticated);

citiesRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      state_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(120).required(),
    }),
  }),
  createController.handle
);

citiesRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      state_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(120).required(),
    }),
  }),
  updateController.handle
);

citiesRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);

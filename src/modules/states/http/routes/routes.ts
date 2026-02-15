import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { CreateStateController } from "../controllers/CreateStateController";
import { ListStatesController } from "../controllers/ListStatesController";
import { UpdateStateController } from "../controllers/UpdateStateController";
import { DeleteStateController } from "../controllers/DeleteStateController";

export const statesRoutes = Router();

const createController = new CreateStateController();
const listController = new ListStatesController();
const updateController = new UpdateStateController();
const deleteController = new DeleteStateController();

statesRoutes.get("/", listController.handle);

statesRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(120).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

statesRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().trim().min(2).max(120).required()
    })
  }),
  createController.handle
);

statesRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required()
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().trim().min(2).max(120).required()
    })
  }),
  updateController.handle
);

statesRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required()
    })
  }),
  deleteController.handle
);

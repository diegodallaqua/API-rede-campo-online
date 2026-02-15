import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { CreateAddressController } from "../controllers/CreateAddressController";
import { ListAddressesController } from "../controllers/ListAddressesController";
import { UpdateAddressController } from "../controllers/UpdateAddressController";
import { DeleteAddressController } from "../controllers/DeleteAddressController";


export const addressesRoutes = Router();

const createController = new CreateAddressController();
const listController = new ListAddressesController();
const updateController = new UpdateAddressController();
const deleteController = new DeleteAddressController();

addressesRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(150).optional(),
      city_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

addressesRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      city_id: Joi.number().integer().positive().required(),
      street: Joi.string().trim().min(2).max(150).required(),
      neighborhood: Joi.string().trim().min(2).max(150).required(),
      number: Joi.number().integer().min(0).required(),
      cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
      complement: Joi.string().trim().max(150).optional().allow(null, ""),
    }),
  }),
  createController.handle
);

addressesRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      city_id: Joi.number().integer().positive().required(),
      street: Joi.string().trim().min(2).max(150).required(),
      neighborhood: Joi.string().trim().min(2).max(150).required(),
      number: Joi.number().integer().min(0).required(),
      cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
      complement: Joi.string().trim().max(150).optional().allow(null, ""),
    }),
  }),
  updateController.handle
);

addressesRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);

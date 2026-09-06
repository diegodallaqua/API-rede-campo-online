import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateMemberController } from "../controllers/CreateMemberController";
import { ListMembersController } from "../controllers/ListMembersController";
import { UpdateMemberController } from "../controllers/UpdateMemberController";
import { DeleteMemberController } from "../controllers/DeleteMemberController";

export const membersRoutes = Router();

const createController = new CreateMemberController();
const listController = new ListMembersController();
const updateController = new UpdateMemberController();
const deleteController = new DeleteMemberController();

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

membersRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      search: Joi.string().trim().min(1).max(180).optional(),
      member_role_id: Joi.number().integer().positive().optional(),
      organization_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

membersRoutes.use(isAuthenticated);

membersRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      member_role_id: Joi.number().integer().positive().required(),
      organization_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(160).required(),
      email: Joi.string().trim().email().max(180).required(),
      description: Joi.string().trim().min(2).max(2000).required(),
      lattes_url: Joi.string().trim().max(255).optional().allow(null, ""),
      linked_in_url: Joi.string().trim().max(255).optional().allow(null, ""),
      instagram_url: Joi.string().trim().max(255).optional().allow(null, ""),
      profile_picture: Joi.string().trim().max(255).optional().allow(null, ""),
      password: Joi.string().min(8).max(100).optional().allow(null, ""),
    }),
  }),
  createController.handle
);

membersRoutes.put(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      member_role_id: Joi.number().integer().positive().required(),
      organization_id: Joi.number().integer().positive().required(),
      name: Joi.string().trim().min(2).max(160).required(),
      email: Joi.string().trim().email().max(180).required(),
      description: Joi.string().trim().min(2).max(2000).required(),
      lattes_url: Joi.string().trim().max(255).optional().allow(null, ""),
      linked_in_url: Joi.string().trim().max(255).optional().allow(null, ""),
      instagram_url: Joi.string().trim().max(255).optional().allow(null, ""),
      profile_picture: Joi.string().trim().max(255).optional().allow(null, ""),
      password: Joi.string().min(8).max(100).optional().allow(null, ""),
    }),
  }),
  updateController.handle
);

membersRoutes.delete(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);

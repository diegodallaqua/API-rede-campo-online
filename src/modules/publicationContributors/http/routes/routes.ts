import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreatePublicationContributorController } from "../controllers/CreatePublicationContributorController";
import { ListPublicationContributorsController } from "../controllers/ListPublicationContributorsController";
import { UpdatePublicationContributorController } from "../controllers/UpdatePublicationContributorController";
import { DeletePublicationContributorController } from "../controllers/DeletePublicationContributorController";

export const publicationContributorsRoutes = Router();

const createController = new CreatePublicationContributorController();
const listController = new ListPublicationContributorsController();
const updateController = new UpdatePublicationContributorController();
const deleteController = new DeletePublicationContributorController();

publicationContributorsRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      publication_id: Joi.number().integer().positive().optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

publicationContributorsRoutes.use(isAuthenticated);

publicationContributorsRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      member_id: Joi.number().integer().positive().optional().allow(null),
      external_author_id: Joi.number().integer().positive().optional().allow(null),
      contributor_role_id: Joi.number().integer().positive().required(),
      author_order: Joi.number().integer().positive().required(),
    })
      .custom((value, helpers) => {
        const hasMember = value.member_id != null;
        const hasExternal = value.external_author_id != null;

        if ((hasMember && hasExternal) || (!hasMember && !hasExternal)) {
          return helpers.error("any.invalid");
        }

        return value;
      }, "exclusive contributor validation")
      .messages({
        "any.invalid":
          "Exactly one of member_id or external_author_id must be provided",
      }),
  }),
  createController.handle
);

publicationContributorsRoutes.put(
  "/:publication_id/:author_order",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      author_order: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      member_id: Joi.number().integer().positive().optional().allow(null),
      external_author_id: Joi.number().integer().positive().optional().allow(null),
      contributor_role_id: Joi.number().integer().positive().required(),
      author_order: Joi.number().integer().positive().required(),
    })
      .custom((value, helpers) => {
        const hasMember = value.member_id != null;
        const hasExternal = value.external_author_id != null;

        if ((hasMember && hasExternal) || (!hasMember && !hasExternal)) {
          return helpers.error("any.invalid");
        }

        return value;
      }, "exclusive contributor validation")
      .messages({
        "any.invalid":
          "Exactly one of member_id or external_author_id must be provided",
      }),
  }),
  updateController.handle
);

publicationContributorsRoutes.delete(
  "/:publication_id/:author_order",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      author_order: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
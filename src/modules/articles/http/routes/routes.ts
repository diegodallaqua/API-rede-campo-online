import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";


import { CreateArticleController } from "../controllers/CreateArticleController";
import { ListArticlesController } from "../controllers/ListArticlesController";
import { UpdateArticleController } from "../controllers/UpdateArticleController";
import { DeleteArticleController } from "../controllers/DeleteArticleController";

export const articlesRoutes = Router();

const createController = new CreateArticleController();
const listController = new ListArticlesController();
const updateController = new UpdateArticleController();
const deleteController = new DeleteArticleController();

articlesRoutes.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object({
      title: Joi.string().trim().min(1).max(255).optional(),
      page: Joi.number().integer().min(1).optional(),
      take: Joi.number().integer().min(1).max(100).optional(),
    }),
  }),
  listController.handle
);

articlesRoutes.use(isAuthenticated);

articlesRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      journal_name: Joi.string().trim().min(2).max(255).required(),
      volume: Joi.string().trim().max(100).optional().allow(null, ""),
      issue: Joi.string().trim().max(100).optional().allow(null, ""),
      pages: Joi.string().trim().max(100).optional().allow(null, ""),
      publisher: Joi.string().trim().max(255).optional().allow(null, ""),
    }),
  }),
  createController.handle
);

articlesRoutes.put(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      journal_name: Joi.string().trim().min(2).max(255).required(),
      volume: Joi.string().trim().max(100).optional().allow(null, ""),
      issue: Joi.string().trim().max(100).optional().allow(null, ""),
      pages: Joi.string().trim().max(100).optional().allow(null, ""),
      publisher: Joi.string().trim().max(255).optional().allow(null, ""),
    }),
  }),
  updateController.handle
);

articlesRoutes.delete(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
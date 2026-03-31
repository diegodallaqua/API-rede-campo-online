import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateBookController } from "../controllers/CreateBookController";
import { ListBooksController } from "../controllers/ListBooksController";
import { UpdateBookController } from "../controllers/UpdateBookController";
import { DeleteBookController } from "../controllers/DeleteBookController";

export const booksRoutes = Router();

const createController = new CreateBookController();
const listController = new ListBooksController();
const updateController = new UpdateBookController();
const deleteController = new DeleteBookController();

booksRoutes.get(
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


booksRoutes.use(isAuthenticated);

booksRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      publisher: Joi.string().trim().min(2).max(255).required(),
      edition: Joi.string().trim().min(1).max(100).required(),
      cover_photo: Joi.string().trim().max(255).optional().allow(null, ""),
    }),
  }),
  createController.handle
);

booksRoutes.put(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      publisher: Joi.string().trim().min(2).max(255).required(),
      edition: Joi.string().trim().min(1).max(100).required(),
      cover_photo: Joi.string().trim().max(255).optional().allow(null, ""),
    }),
  }),
  updateController.handle
);

booksRoutes.delete(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import { isAuthenticated } from "../../../../shared/infra/http/middlewares/isAuthenticated";

import { CreateBookChapterController } from "../controllers/CreateBookChapterController";
import { ListBookChaptersController } from "../controllers/ListBookChaptersController";
import { UpdateBookChapterController } from "../controllers/UpdateBookChapterController";
import { DeleteBookChapterController } from "../controllers/DeleteBookChapterController";

export const bookChaptersRoutes = Router();

const createController = new CreateBookChapterController();
const listController = new ListBookChaptersController();
const updateController = new UpdateBookChapterController();
const deleteController = new DeleteBookChapterController();

bookChaptersRoutes.get(
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

bookChaptersRoutes.use(isAuthenticated);

bookChaptersRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
      book_name: Joi.string().trim().min(2).max(255).required(),
      chapter_number: Joi.number().integer().positive().required(),
    }),
  }),
  createController.handle
);

bookChaptersRoutes.put(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      book_name: Joi.string().trim().min(2).max(255).required(),
      chapter_number: Joi.number().integer().positive().required(),
    }),
  }),
  updateController.handle
);

bookChaptersRoutes.delete(
  "/:publication_id",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      publication_id: Joi.number().integer().positive().required(),
    }),
  }),
  deleteController.handle
);
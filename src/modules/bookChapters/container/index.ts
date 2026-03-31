import { container } from "tsyringe";
import { IBookChapterRepository } from "../repositories/IBookChapterRepository";
import { BookChapterRepository } from "../repositories/BookChaptersRepository";

container.registerSingleton<IBookChapterRepository>(
  "BookChapterRepository",
  BookChapterRepository
);
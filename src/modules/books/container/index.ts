import { container } from "tsyringe";
import { IBookRepository } from "../repositories/IBookRepository";
import { BookRepository } from "../repositories/BooksRepository";

container.registerSingleton<IBookRepository>(
  "BookRepository",
  BookRepository
);
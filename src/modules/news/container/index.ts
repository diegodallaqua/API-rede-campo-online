import { container } from "tsyringe";
import { INewsRepository } from "../repositories/INewsRepository";
import { NewsRepository } from "../repositories/NewsRepository";

container.registerSingleton<INewsRepository>(
  "NewsRepository",
  NewsRepository
);
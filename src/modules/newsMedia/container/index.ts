import { container } from "tsyringe";
import { INewsMediaRepository } from "../repositories/INewsMediaRepository";
import { NewsMediaRepository } from "../repositories/NewsMediaRepository";

container.registerSingleton<INewsMediaRepository>(
  "NewsMediaRepository",
  NewsMediaRepository
);
import { container } from "tsyringe";
import { INewsHasResearchAreasRepository } from "../repositories/INewsHasResearchAreaRepository";
import { NewsHasResearchAreasRepository } from "../repositories/NewsHasResearchAreasRepository";

container.registerSingleton<INewsHasResearchAreasRepository>(
  "NewsHasResearchAreasRepository",
  NewsHasResearchAreasRepository
);
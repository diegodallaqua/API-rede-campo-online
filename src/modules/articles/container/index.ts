import { container } from "tsyringe";
import { IArticleRepository } from "../repositories/IArticleRepository";
import { ArticleRepository } from "../repositories/ArticlesRepository";

container.registerSingleton<IArticleRepository>(
  "ArticleRepository",
  ArticleRepository
);
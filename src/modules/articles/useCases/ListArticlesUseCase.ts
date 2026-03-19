import { inject, injectable } from "tsyringe";
import {
  IArticleRepository,
  ArticlePaginateProperties,
} from "../repositories/IArticleRepository";

type IRequest = {
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListArticlesUseCase {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository
  ) {}

  async execute({
    title,
    page,
    take,
  }: IRequest): Promise<ArticlePaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.articleRepository.findAll({
      title,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}
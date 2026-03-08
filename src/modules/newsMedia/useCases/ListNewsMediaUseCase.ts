import { inject, injectable } from "tsyringe";
import { INewsMediaRepository, NewsMediaPaginateProperties } from "../repositories/INewsMediaRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  news_id?: number;
};

@injectable()
export class ListNewsMediaUseCase {
  constructor(
    @inject("NewsMediaRepository")
    private newsMediaRepository: INewsMediaRepository
  ) {}

  async execute({
    search,
    page,
    take,
    news_id,
  }: IRequest): Promise<NewsMediaPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake =
      Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.newsMediaRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      news_id,
    });
  }
}
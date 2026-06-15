import { inject, injectable } from "tsyringe";
import { INewsRepository, NewsPaginateProperties, NewsListItem } from "../repositories/INewsRepository";
import { INewsHasResearchAreasRepository } from "../../newsHasResearchAreas/repositories/INewsHasResearchAreaRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
};

@injectable()
export class ListNewsUseCase {
  constructor(
    @inject("NewsRepository")
    private newsRepository: INewsRepository,

    @inject("NewsHasResearchAreasRepository")
    private newsHasResearchAreasRepository: INewsHasResearchAreasRepository
  ) {}

  async execute({
    search,
    page,
    take,
  }: IRequest): Promise<NewsPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const news = await this.newsRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData: NewsListItem[] = await Promise.all(
      news.data.map(async (item) => {
        const researchAreas =
          await this.newsHasResearchAreasRepository.findResearchAreasByNewsId(item.id);

        return {
          ...item,
          research_areas: researchAreas,
        };
      })
    );

    return {
      per_page: news.per_page,
      total: news.total,
      current_page: news.current_page,
      data: enrichedData,
    };
  }
}
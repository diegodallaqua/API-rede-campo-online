import { inject, injectable } from "tsyringe";
import { INewsRepository, NewsPaginateProperties } from "../repositories/INewsRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  project_id?: number;
};

@injectable()
export class ListNewsUseCase {
  constructor(
    @inject("NewsRepository")
    private newsRepository: INewsRepository
  ) {}

  async execute({
    search,
    page,
    take,
    project_id,
  }: IRequest): Promise<NewsPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.newsRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      project_id,
    });
  }
}
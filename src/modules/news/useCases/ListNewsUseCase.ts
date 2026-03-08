import { inject, injectable } from "tsyringe";
import { INewRepository, NewsPaginateProperties } from "../repositories/INewRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  project_id?: number;
};

@injectable()
export class ListNewsUseCase {
  constructor(
    @inject("NewRepository")
    private newRepository: INewRepository
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

    return this.newRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      project_id,
    });
  }
}
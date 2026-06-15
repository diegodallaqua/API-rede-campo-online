import { inject, injectable } from "tsyringe";
import {
  IResearchAreaRepository,
  ResearchAreaPaginateProperties,
} from "../repositories/IResearchAreaRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
};

@injectable()
export class ListResearchAreasUseCase {
  constructor(
    @inject("ResearchAreaRepository")
    private ResearchAreaRepository: IResearchAreaRepository
  ) {}

  async execute({
    search,
    page,
    take,
  }: IRequest): Promise<ResearchAreaPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 400 ? take : 400;

    const skip = (safePage - 1) * safeTake;

    return this.ResearchAreaRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}

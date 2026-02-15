import { inject, injectable } from "tsyringe";
import { ICityRepository, CitiesPaginateProperties } from "../repositories/ICityRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  state_id?: number;
};

@injectable()
export class ListCitiesUseCase {
  constructor(
    @inject("CityRepository")
    private citiesRepository: ICityRepository
  ) {}

  async execute({ search, page, take, state_id }: IRequest): Promise<CitiesPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.citiesRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      state_id,
    });
  }
}

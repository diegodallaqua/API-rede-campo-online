import { inject, injectable } from "tsyringe";
import {
  IStatesRepository,
  StatesPaginateProperties,
} from "../repositories/IStatesRepository";

type IRequest = {
  search?: string;
  page?: number;
  take?: number;
};

@injectable()
export class ListStatesUseCase {
  constructor(
    @inject("StatesRepository")
    private readonly statesRepository: IStatesRepository
  ) {}

  async execute({search = "",page = 1,take = 10,}: IRequest): Promise<StatesPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeTake =
      Number.isFinite(take) && take > 0 && take <= 100 ? Math.floor(take) : 10;

    const skip = (safePage - 1) * safeTake;

    return this.statesRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}

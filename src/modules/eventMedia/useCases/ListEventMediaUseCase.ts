import { inject, injectable } from "tsyringe";
import { IEventMediaRepository, EventMediaPaginateProperties } from "../repositories/IEventMediaRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  event_id?: number;
};

@injectable()
export class ListEventMediaUseCase {
  constructor(
    @inject("EventMediaRepository")
    private eventMediaRepository: IEventMediaRepository
  ) {}

  async execute({ search, page, take, event_id }: IRequest): Promise<EventMediaPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;
    const skip = (safePage - 1) * safeTake;

    return this.eventMediaRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      event_id,
    });
  }
}
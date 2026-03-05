import { inject, injectable } from "tsyringe";
import { EventsPaginateProperties, IEventRepository } from "../repositories/IEventRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  project_id?: number;
};

@injectable()
export class ListEventsUseCase {
  constructor(
    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute({ search, page, take, project_id }: IRequest): Promise<EventsPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.eventRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      project_id,
    });
  }
}
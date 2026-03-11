import { inject, injectable } from "tsyringe";
import {
  IPublicationRepository,
  PublicationPaginateProperties,
} from "../repositories/IPublicationRepository";

type IRequest = {
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListPublicationsUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute({
    title,
    page,
    take,
  }: IRequest): Promise<PublicationPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.publicationRepository.findAll({
      title,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}
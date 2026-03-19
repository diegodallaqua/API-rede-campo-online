import { inject, injectable } from "tsyringe";
import {
  IPublicationContributorRepository,
  PublicationContributorPaginateProperties,
} from "../repositories/IPublicationContributorRepository";

type IRequest = {
  publication_id?: number;
  page: number;
  take: number;
};

@injectable()
export class ListPublicationContributorsUseCase {
  constructor(
    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute({
    publication_id,
    page,
    take,
  }: IRequest): Promise<PublicationContributorPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.publicationContributorRepository.findAll({
      publication_id,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}
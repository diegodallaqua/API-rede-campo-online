import { inject, injectable } from "tsyringe";
import {
  IExternalAuthorRepository,
  ExternalAuthorPaginateProperties,
} from "../repositories/IExternalAuthorRepository";

type IRequest = {
  name?: string;
  page: number;
  take: number;
};

@injectable()
export class ListExternalAuthorsUseCase {
  constructor(
    @inject("ExternalAuthorRepository")
    private externalAuthorRepository: IExternalAuthorRepository
  ) {}

  async execute({
    name,
    page,
    take,
  }: IRequest): Promise<ExternalAuthorPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.externalAuthorRepository.findAll({
      name,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}
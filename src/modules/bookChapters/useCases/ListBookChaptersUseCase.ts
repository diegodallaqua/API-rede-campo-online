import { inject, injectable } from "tsyringe";
import {
  IBookChapterRepository,
  BookChapterPaginateProperties,
} from "../repositories/IBookChapterRepository";

type IRequest = {
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListBookChaptersUseCase {
  constructor(
    @inject("BookChapterRepository")
    private bookChapterRepository: IBookChapterRepository
  ) {}

  async execute({
    title,
    page,
    take,
  }: IRequest): Promise<BookChapterPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.bookChapterRepository.findAll({
      title,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  IBookChapterRepository,
  IUpdateBookChapterDTO,
} from "../repositories/IBookChapterRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";

@injectable()
export class UpdateBookChapterUseCase {
  constructor(
    @inject("BookChapterRepository")
    private bookChapterRepository: IBookChapterRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute(data: IUpdateBookChapterDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const exists = await this.bookChapterRepository.existsByPublicationId(data.publication_id);
    if (!exists) {
      throw new AppError("Book chapter not found", 404, "BOOK_CHAPTER_NOT_FOUND");
    }

    if (data.chapter_number <= 0) {
      throw new AppError(
        "chapter_number must be greater than zero",
        400,
        "INVALID_CHAPTER_NUMBER"
      );
    }

    await this.bookChapterRepository.update({
      publication_id: data.publication_id,
      book_name: data.book_name.trim(),
      chapter_number: data.chapter_number,
    });
  }
}
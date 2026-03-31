import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IBookChapterRepository } from "../repositories/IBookChapterRepository";

@injectable()
export class DeleteBookChapterUseCase {
  constructor(
    @inject("BookChapterRepository")
    private bookChapterRepository: IBookChapterRepository
  ) {}

  async execute(publication_id: number): Promise<void> {
    const exists = await this.bookChapterRepository.existsByPublicationId(publication_id);

    if (!exists) {
      throw new AppError("Book chapter not found", 404, "BOOK_CHAPTER_NOT_FOUND");
    }

    await this.bookChapterRepository.delete(publication_id);
  }
}
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IBookRepository } from "../repositories/IBookRepository";

@injectable()
export class DeleteBookUseCase {
  constructor(
    @inject("BookRepository")
    private bookRepository: IBookRepository
  ) {}

  async execute(publication_id: number): Promise<void> {
    const exists = await this.bookRepository.existsByPublicationId(publication_id);

    if (!exists) {
      throw new AppError("Book not found", 404, "BOOK_NOT_FOUND");
    }

    await this.bookRepository.delete(publication_id);
  }
}
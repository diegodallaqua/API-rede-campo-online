import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  IBookChapterRepository,
  ICreateBookChapterDTO,
} from "../repositories/IBookChapterRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";
import { IBookRepository } from "../../books/repositories/IBookRepository";

@injectable()
export class CreateBookChapterUseCase {
  constructor(
    @inject("BookChapterRepository")
    private bookChapterRepository: IBookChapterRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("BookRepository")
    private bookRepository: IBookRepository
  ) {}

  async execute(data: ICreateBookChapterDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    if (data.book_id) {
      const bookExists = await this.bookRepository.existsByPublicationId(data.book_id);
      if (!bookExists) {
        throw new AppError("Book not found", 404, "BOOK_NOT_FOUND");
      }
    }

    const alreadyExists = await this.bookChapterRepository.existsByPublicationId(
      data.publication_id
    );
    if (alreadyExists) {
      throw new AppError(
        "Book chapter already exists for this publication",
        409,
        "BOOK_CHAPTER_ALREADY_EXISTS"
      );
    }

    if (data.chapter_number <= 0) {
      throw new AppError(
        "chapter_number must be greater than zero",
        400,
        "INVALID_CHAPTER_NUMBER"
      );
    }

    await this.bookChapterRepository.create({
      publication_id: data.publication_id,
      book_id: data.book_id ?? null,
      book_name: data.book_name.trim(),
      chapter_number: data.chapter_number,
      isbn: data.isbn?.trim() || null,
      start_page: data.start_page.trim(),
      end_page: data.end_page.trim(),
    });
  }
}

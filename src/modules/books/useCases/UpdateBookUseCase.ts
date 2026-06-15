import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IBookRepository, IUpdateBookDTO } from "../repositories/IBookRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";

@injectable()
export class UpdateBookUseCase {
  constructor(
    @inject("BookRepository")
    private bookRepository: IBookRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute(data: IUpdateBookDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const exists = await this.bookRepository.existsByPublicationId(data.publication_id);
    if (!exists) {
      throw new AppError("Book not found", 404, "BOOK_NOT_FOUND");
    }

    await this.bookRepository.update({
      publication_id: data.publication_id,
      publisher: data.publisher.trim(),
      edition: data.edition.trim(),
      cover_photo: data.cover_photo?.trim() || null,
      isbn: data.isbn.trim(),
      book_url: data.book_url?.trim() || null,
    });
  }
}
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IBookRepository, ICreateBookDTO } from "../repositories/IBookRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";

@injectable()
export class CreateBookUseCase {
  constructor(
    @inject("BookRepository")
    private bookRepository: IBookRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute(data: ICreateBookDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const alreadyExists = await this.bookRepository.existsByPublicationId(
      data.publication_id
    );
    if (alreadyExists) {
      throw new AppError(
        "Book already exists for this publication",
        409,
        "BOOK_ALREADY_EXISTS"
      );
    }

    await this.bookRepository.create({
      publication_id: data.publication_id,
      publisher: data.publisher.trim(),
      edition: data.edition.trim(),
      cover_photo: data.cover_photo?.trim() || null,
      isbn: data.isbn.trim(),
      book_url: data.book_url?.trim() || null,
    });
  }
}
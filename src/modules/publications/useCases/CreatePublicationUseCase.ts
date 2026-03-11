import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Publication } from "../entities/Publication";
import { IPublicationRepository } from "../repositories/IPublicationRepository";

type IRequest = {
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
};

@injectable()
export class CreatePublicationUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute({
    title,
    abstract,
    publication_date,
    doi,
  }: IRequest): Promise<Publication> {
    const parsedDate = new Date(publication_date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new AppError("Invalid publication_date", 400, "INVALID_PUBLICATION_DATE");
    }

    const normalizedDoi = doi?.trim() || null;

    if (normalizedDoi) {
      const existing = await this.publicationRepository.findByDoi(normalizedDoi);
      if (existing) {
        throw new AppError("DOI already exists", 409, "DOI_ALREADY_EXISTS");
      }
    }

    return this.publicationRepository.create({
      title: title.trim(),
      abstract: abstract.trim(),
      publication_date,
      doi: normalizedDoi,
    });
  }
}
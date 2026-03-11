import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Publication } from "../entities/Publication";
import { IPublicationRepository } from "../repositories/IPublicationRepository";

type IRequest = {
  id: number;
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
};

@injectable()
export class UpdatePublicationUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute({
    id,
    title,
    abstract,
    publication_date,
    doi,
  }: IRequest): Promise<Publication> {
    const publication = await this.publicationRepository.findById(id);

    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const parsedDate = new Date(publication_date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new AppError("Invalid publication_date", 400, "INVALID_PUBLICATION_DATE");
    }

    const normalizedDoi = doi?.trim() || null;

    if (normalizedDoi) {
      const existing = await this.publicationRepository.findByDoi(normalizedDoi);
      if (existing && existing.id !== id) {
        throw new AppError("DOI already exists", 409, "DOI_ALREADY_EXISTS");
      }
    }

    return this.publicationRepository.update({
      id,
      title: title.trim(),
      abstract: abstract.trim(),
      publication_date,
      doi: normalizedDoi,
    });
  }
}
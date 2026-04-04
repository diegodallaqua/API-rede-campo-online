import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Publication } from "../entities/Publication";
import { IPublicationRepository } from "../repositories/IPublicationRepository";
import { IResearchAreaRepository } from "../../researchAreas/repositories/IResearchAreaRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";

type IRequest = {
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
  research_area_ids?: number[];
};

@injectable()
export class CreatePublicationUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("ResearchAreaRepository")
    private researchAreaRepository: IResearchAreaRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository
  ) {}

  async execute({
    title,
    abstract,
    publication_date,
    doi,
    research_area_ids = [],
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

    const uniqueResearchAreaIds = [...new Set(research_area_ids)];

    for (const researchAreaId of uniqueResearchAreaIds) {
      const researchArea = await this.researchAreaRepository.findById(researchAreaId);
      if (!researchArea) {
        throw new AppError(
          `Research area ${researchAreaId} not found`,
          404,
          "RESEARCH_AREA_NOT_FOUND"
        );
      }
    }

    const publication = await this.publicationRepository.create({
      title: title.trim(),
      abstract: abstract.trim(),
      publication_date,
      doi: normalizedDoi,
    });

    await this.publicationHasResearchAreasRepository.createMany(
      uniqueResearchAreaIds.map((research_area_id) => ({
        publication_id: publication.id,
        research_area_id,
      }))
    );

    return publication;
  }
}
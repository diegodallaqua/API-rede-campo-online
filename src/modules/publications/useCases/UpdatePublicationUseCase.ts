import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Publication } from "../entities/Publication";
import { IPublicationRepository } from "../repositories/IPublicationRepository";
import { IResearchAreaRepository } from "../../researchAreas/repositories/IResearchAreaRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";

type IRequest = {
  id: number;
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
  research_area_ids?: number[];
};

@injectable()
export class UpdatePublicationUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("ResearchAreaRepository")
    private researchAreaRepository: IResearchAreaRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository
  ) {}

  async execute({
    id,
    title,
    abstract,
    publication_date,
    doi,
    research_area_ids = [],
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

    const updatedPublication = await this.publicationRepository.update({
      id,
      title: title.trim(),
      abstract: abstract.trim(),
      publication_date,
      doi: normalizedDoi,
    });

    await this.publicationHasResearchAreasRepository.deleteByPublicationId(id);

    await this.publicationHasResearchAreasRepository.createMany(
      uniqueResearchAreaIds.map((research_area_id) => ({
        publication_id: id,
        research_area_id,
      }))
    );

    return updatedPublication;
  }
}
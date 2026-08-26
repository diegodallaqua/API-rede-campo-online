import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  IPublicationRepository,
  PublicationProject,
  PublicationWithResearchAreas,
} from "../repositories/IPublicationRepository";
import { IResearchAreaRepository } from "../../researchAreas/repositories/IResearchAreaRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IProjectRepository } from "../../projects/repositories/IProjectRepository";

type IRequest = {
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
  project_id?: number | null;
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
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("ProjectRepository")
    private projectRepository: IProjectRepository
  ) {}

  async execute({
    title,
    abstract,
    publication_date,
    doi,
    project_id,
    research_area_ids = [],
  }: IRequest): Promise<PublicationWithResearchAreas> {
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

    const normalizedProjectId = project_id ?? null;

    let project: PublicationProject | null = null;

    if (normalizedProjectId !== null) {
      const foundProject = await this.projectRepository.findByIdWithRelations(
        normalizedProjectId
      );

      if (!foundProject) {
        throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
      }

      project = {
        id: foundProject.id,
        name: foundProject.name,
        description: foundProject.description,
        status: foundProject.status,
        begin_date: foundProject.begin_date,
        end_date: foundProject.end_date,
        projectType: foundProject.projectType,
      };
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
      project_id: normalizedProjectId,
    });

    await this.publicationHasResearchAreasRepository.createMany(
      uniqueResearchAreaIds.map((research_area_id) => ({
        publication_id: publication.id,
        research_area_id,
      }))
    );

    const researchAreas =
      await this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
        publication.id
      );

    return {
      id: publication.id,
      title: publication.title,
      abstract: publication.abstract,
      publication_date: publication.publication_date,
      doi: publication.doi ?? null,
      project,
      details: null,
      research_areas: researchAreas,
      contributors: [],
    };
  }
}
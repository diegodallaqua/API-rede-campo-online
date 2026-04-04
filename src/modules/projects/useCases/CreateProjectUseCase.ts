import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IProjectRepository } from "../repositories/IProjectRepository";
import { IProjectTypeRepository } from "../../projectTypes/repositories/IProjectTypeRepository";
import { IResearchAreaRepository } from "../../researchAreas/repositories/IResearchAreaRepository";
import { IProjectHasResearchAreasRepository } from "../../projectHasResearchAreas/repositories/IProjectHasResearchAreaRepository";

type IRequest = {
  project_type_id: number;
  name: string;
  description: string;
  status: boolean;
  begin_date: string;
  end_date?: string | null;
  external_staff?: string | null;
  research_area_ids?: number[];
};

@injectable()
export class CreateProjectUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,

    @inject("ProjectTypeRepository")
    private projectTypeRepository: IProjectTypeRepository,

    @inject("ResearchAreaRepository")
    private researchAreaRepository: IResearchAreaRepository,

    @inject("ProjectHasResearchAreasRepository")
    private projectHasResearchAreasRepository: IProjectHasResearchAreasRepository
  ) {}

  async execute({
    project_type_id,
    name,
    description,
    status,
    begin_date,
    end_date,
    external_staff,
    research_area_ids = [],
  }: IRequest): Promise<void> {
    const type = await this.projectTypeRepository.findById(project_type_id);
    if (!type) {
      throw new AppError("Project type not found", 404, "PROJECT_TYPE_NOT_FOUND");
    }

    const begin = begin_date;
    const end = end_date ?? null;

    if (end && end < begin) {
      throw new AppError("end_date cannot be before begin_date", 400, "INVALID_DATE_RANGE");
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

    const createdProject = await this.projectRepository.create({
      project_type_id,
      name: name.trim(),
      description: description.trim(),
      status,
      begin_date,
      end_date: end,
    });

    await this.projectHasResearchAreasRepository.createMany(
      uniqueResearchAreaIds.map((research_area_id) => ({
        project_id: createdProject.id,
        research_area_id,
      }))
    );
  }
}
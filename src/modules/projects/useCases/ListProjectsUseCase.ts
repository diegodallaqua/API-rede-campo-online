import { inject, injectable } from "tsyringe";
import { IProjectRepository, ProjectsPaginateProperties, ProjectListItem } from "../repositories/IProjectRepository";
import { IProjectHasResearchAreasRepository } from "../../projectHasResearchAreas/repositories/IProjectHasResearchAreaRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  project_name?: string;
  status?: boolean;
};

@injectable()
export class ListProjectsUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,

    @inject("ProjectHasResearchAreasRepository")
    private projectHasResearchAreasRepository: IProjectHasResearchAreasRepository
  ) {}

  async execute(params: IRequest): Promise<ProjectsPaginateProperties> {
    const safePage = Number.isFinite(params.page) && params.page > 0 ? params.page : 1;
    const safeTake =
      Number.isFinite(params.take) && params.take > 0 && params.take <= 100
        ? params.take
        : 10;

    const skip = (safePage - 1) * safeTake;

    const projects = await this.projectRepository.findAll({
      search: params.search,
      page: safePage,
      skip,
      take: safeTake,
      project_name: params.project_name,
      status: params.status,
    });

    const enrichedData: ProjectListItem[] = await Promise.all(
      projects.data.map(async (project) => {
        const researchAreas =
          await this.projectHasResearchAreasRepository.findResearchAreasByProjectId(
            project.id
          );

        return {
          ...project,
          research_areas: researchAreas,
        };
      })
    );

    return {
      per_page: projects.per_page,
      total: projects.total,
      current_page: projects.current_page,
      data: enrichedData,
    };
  }
}
import { inject, injectable } from "tsyringe";
import {
  IProjectRepository,
  ProjectsPaginateProperties,
  ProjectListItem,
} from "../repositories/IProjectRepository";
import { IProjectHasResearchAreasRepository } from "../../projectHasResearchAreas/repositories/IProjectHasResearchAreaRepository";
import { IProjectHasMembersRepository } from "../../projectHasMembers/repositories/IProjectHasMembersRepository";

type IRequest = {
  project_name?: string;
  page: number;
  take: number;
  status?: boolean;
};

@injectable()
export class ListProjectsUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,

    @inject("ProjectHasResearchAreasRepository")
    private projectHasResearchAreasRepository: IProjectHasResearchAreasRepository,

    @inject("ProjectHasMembersRepository")
    private projectHasMembersRepository: IProjectHasMembersRepository
  ) {}

  async execute({
    project_name,
    page,
    take,
    status,
  }: IRequest): Promise<ProjectsPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake =
      Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const projects = await this.projectRepository.findAll({
      project_name,
      page: safePage,
      skip,
      take: safeTake,
      status,
    });

    const enrichedData: ProjectListItem[] = await Promise.all(
      projects.data.map(async (project) => {
        const researchAreas =
          await this.projectHasResearchAreasRepository.findResearchAreasByProjectId(
            project.id
          );

        const members =
          await this.projectHasMembersRepository.findMembersByProjectId(project.id);

        return {
          ...project,
          research_areas: researchAreas,
          members,
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
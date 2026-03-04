import { inject, injectable } from "tsyringe";
import { IProjectRepository, ProjectsPaginateProperties } from "../repositories/IProjectRepository";

type IRequest = {
  page: number;
  take: number;

  project_name?: string;
  project_type_id?: number;
  project_type_name?: string;
  status?: boolean;
};

@injectable()
export class ListProjectsUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository
  ) {}

  async execute(params: IRequest): Promise<ProjectsPaginateProperties> {
    const safePage = Number.isFinite(params.page) && params.page > 0 ? params.page : 1;
    const safeTake =
      Number.isFinite(params.take) && params.take > 0 && params.take <= 100 ? params.take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.projectRepository.findAll({
      page: safePage,
      skip,
      take: safeTake,
      project_name: params.project_name,
      project_type_id: params.project_type_id,
      status: params.status,
    });
  }
}
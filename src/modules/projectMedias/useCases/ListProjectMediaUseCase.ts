import { inject, injectable } from "tsyringe";
import {
  IProjectMediaRepository,
  ProjectMediaPaginateProperties,
} from "../repositories/IProjectMediaRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  project_id?: number;
};

@injectable()
export class ListProjectMediaUseCase {
  constructor(
    @inject("ProjectMediaRepository")
    private projectMediaRepository: IProjectMediaRepository
  ) {}

  async execute({
    search,
    page,
    take,
    project_id,
  }: IRequest): Promise<ProjectMediaPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake =
      Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;
    const skip = (safePage - 1) * safeTake;

    return this.projectMediaRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      project_id,
    });
  }
}
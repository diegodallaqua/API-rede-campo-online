import { inject, injectable } from "tsyringe";
import {
  IProjectTypeRepository,
  ProjectTypesPaginateProperties,
} from "../repositories/IProjectTypeRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
};

@injectable()
export class ListProjectTypesUseCase {
  constructor(
    @inject("ProjectTypeRepository")
    private ProjectTypeRepository: IProjectTypeRepository
  ) {}

  async execute({
    search,
    page,
    take,
  }: IRequest): Promise<ProjectTypesPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.ProjectTypeRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}

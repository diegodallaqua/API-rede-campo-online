import { inject, injectable } from "tsyringe";
import {
  IAcademicWorkTypeRepository,
  AcademicWorkTypesPaginateProperties,
} from "../repositories/IAcademicWorkTypeRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
};

@injectable()
export class ListAcademicWorkTypesUseCase {
  constructor(
    @inject("AcademicWorkTypeRepository")
    private academicWorkTypeRepository: IAcademicWorkTypeRepository
  ) {}

  async execute({
    search,
    page,
    take,
  }: IRequest): Promise<AcademicWorkTypesPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.academicWorkTypeRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}

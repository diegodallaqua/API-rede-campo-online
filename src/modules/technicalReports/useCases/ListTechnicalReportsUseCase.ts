import { inject, injectable } from "tsyringe";
import {
  ITechnicalReportRepository,
  TechnicalReportPaginateProperties,
} from "../repositories/ITechnicalReportRepository";

type IRequest = {
  title?: string;
  organization_id?: number;
  page: number;
  take: number;
};

@injectable()
export class ListTechnicalReportsUseCase {
  constructor(
    @inject("TechnicalReportRepository")
    private technicalReportRepository: ITechnicalReportRepository
  ) {}

  async execute({
    title,
    organization_id,
    page,
    take,
  }: IRequest): Promise<TechnicalReportPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.technicalReportRepository.findAll({
      title,
      organization_id,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}
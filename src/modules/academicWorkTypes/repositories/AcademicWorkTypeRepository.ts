import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { AcademicWorkType } from "../entities/AcademicWorkType";
import {
  IAcademicWorkTypeRepository,
  PaginateParams,
  AcademicWorkTypesPaginateProperties,
} from "./IAcademicWorkTypeRepository";

export class AcademicWorkTypeRepository implements IAcademicWorkTypeRepository {
  private ormRepo: Repository<AcademicWorkType>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(AcademicWorkType);
  }

  async findById(id: number): Promise<AcademicWorkType | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<AcademicWorkTypesPaginateProperties> {
    const where = search?.trim()
      ? { name: Like(`%${search.trim()}%`) }
      : {};

    const [data, total] = await this.ormRepo.findAndCount({
      where,
      order: { name: "ASC" },
      skip,
      take,
    });

    return {
      per_page: take,
      total,
      current_page: page,
      data,
    };
  }
}

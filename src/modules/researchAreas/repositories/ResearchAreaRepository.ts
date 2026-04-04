import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ResearchArea } from "../entities/ResearchArea";
import {
  IResearchAreaRepository,
  PaginateParams,
  ResearchAreaPaginateProperties,
} from "./IResearchAreaRepository";

export class ResearchAreaRepository implements IResearchAreaRepository {
  private ormRepo: Repository<ResearchArea>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ResearchArea);
  }

  async findById(id: number): Promise<ResearchArea | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<ResearchAreaPaginateProperties> {
    const where = search?.trim()
      ? { name: Like(`%${search.trim()}%`) }
      : {};

    const [data, total] = await this.ormRepo.findAndCount({
      where,
      order: { id: "ASC" },
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

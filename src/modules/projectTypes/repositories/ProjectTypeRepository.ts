import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ProjectType } from "../entities/ProjectType";
import {
  IProjectTypeRepository,
  PaginateParams,
  ProjectTypesPaginateProperties,
} from "./IProjectTypeRepository";

export class ProjectTypeRepository implements IProjectTypeRepository {
  private ormRepo: Repository<ProjectType>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ProjectType);
  }

  async findById(id: number): Promise<ProjectType | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<ProjectTypesPaginateProperties> {
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

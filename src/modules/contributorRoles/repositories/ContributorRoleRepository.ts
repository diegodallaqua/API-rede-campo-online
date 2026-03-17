import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ContributorRole } from "../entities/ContributorRole";
import {
  IContributorRoleRepository,
  PaginateParams,
  ContributorRolePaginateProperties,
} from "./IContributorRoleRepository";

export class ContributorRoleRepository implements IContributorRoleRepository {
  private ormRepo: Repository<ContributorRole>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ContributorRole);
  }

  async findById(id: number): Promise<ContributorRole | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<ContributorRolePaginateProperties> {
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

import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { MemberRole } from "../entities/MemberRole";
import {
  IMemberRoleRepository,
  PaginateParams,
  MemberRolesPaginateProperties,
} from "./IMemberRoleRepository";

export class MemberRoleRepository implements IMemberRoleRepository {
  private ormRepo: Repository<MemberRole>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(MemberRole);
  }

  async findById(id: number): Promise<MemberRole | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<MemberRolesPaginateProperties> {
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

import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Organization } from "../entities/Organization";
import {
  IOrganizationRepository,
  ICreateOrganizationDTO,
  IUpdateOrganizationDTO,
  PaginateParams,
  OrganizationsPaginateProperties,
} from "./IOrganizationRepository";

export class OrganizationRepository implements IOrganizationRepository {
  private ormRepo: Repository<Organization>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Organization);
  }

  async create(data: ICreateOrganizationDTO): Promise<Organization> {
    const org = this.ormRepo.create(data);
    return this.ormRepo.save(org);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    address_id,
  }: PaginateParams): Promise<OrganizationsPaginateProperties> {
    const base: any = {};
    if (address_id) base.address_id = address_id;

    const trimmed = search?.trim();
    const where = trimmed ? { ...base, name: Like(`%${trimmed}%`) } : base;

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

  async findById(id: number): Promise<Organization | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Organization | null> {
    return this.ormRepo.findOne({ where: { name } });
  }

  async update(data: IUpdateOrganizationDTO): Promise<Organization> {
    await this.ormRepo.update({ id: data.id }, data);
    const updated = await this.findById(data.id);
    return updated as Organization;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}

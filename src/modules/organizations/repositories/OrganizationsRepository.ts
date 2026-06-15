import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Organization } from "../entities/Organization";
import {
  IOrganizationRepository,
  ICreateOrganizationDTO,
  IUpdateOrganizationDTO,
  PaginateParams,
  OrganizationsPaginateProperties,
  OrganizationListItem,
} from "./IOrganizationRepository";

export class OrganizationRepository implements IOrganizationRepository {
  private ormRepo: Repository<Organization>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Organization);
  }

  async create(data: ICreateOrganizationDTO): Promise<Organization> {
    const organization = this.ormRepo.create(data);
    return this.ormRepo.save(organization);
  }

  private mapRawToItem(raw: any): OrganizationListItem {
    return {
      id: Number(raw.o_id),
      name: raw.o_name,
      logo: raw.o_logo,
      address: {
        id: Number(raw.a_id),
        street: raw.a_street,
        neighborhood: raw.a_neighborhood,
        number: Number(raw.a_number),
        cep: raw.a_cep,
        complement: raw.a_complement ?? null,
        city: {
          id: Number(raw.c_id),
          name: raw.c_name,
          state: {
            id: Number(raw.s_id),
            name: raw.s_name,
          },
        },
      },
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("o")
      .innerJoin("o.address", "a")
      .innerJoin("a.city", "c")
      .innerJoin("c.state", "s")
      .select([
        "o.id           as o_id",
        "o.name         as o_name",
        "o.logo         as o_logo",
        "a.id           as a_id",
        "a.street       as a_street",
        "a.neighborhood as a_neighborhood",
        "a.number       as a_number",
        "a.cep          as a_cep",
        "a.complement   as a_complement",
        "c.id           as c_id",
        "c.name         as c_name",
        "s.id           as s_id",
        "s.name         as s_name",
      ]);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    address_id,
  }: PaginateParams): Promise<OrganizationsPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("o.name", "ASC");

    if (address_id) {
      qb.andWhere("o.address_id = :address_id", { address_id });
    }

    if (search?.trim()) {
      qb.andWhere("o.name LIKE :search", { search: `%${search.trim()}%` });
    }

    const countQb = qb.clone();
    qb.limit(take).offset(skip);

    const [raw, total] = await Promise.all([
      qb.getRawMany(),
      countQb.getCount(),
    ]);

    return {
      per_page: take,
      total,
      current_page: page,
      data: raw.map((item) => this.mapRawToItem(item)),
    };
  }

  async findById(id: number): Promise<Organization | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: number): Promise<OrganizationListItem | null> {
    const raw = await this.baseQuery()
      .where("o.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    return this.ormRepo.findOne({ where: { name } });
  }

  async update({ id, ...data }: IUpdateOrganizationDTO): Promise<Organization> {
    await this.ormRepo.update({ id }, data);
    return this.findById(id) as Promise<Organization>;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
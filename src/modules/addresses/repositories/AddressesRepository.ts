import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Address } from "../entities/Address";
import {
  IAddressRepository,
  ICreateAddressDTO,
  IUpdateAddressDTO,
  PaginateParams,
  AddressesPaginateProperties,
  AddressListItem,
} from "./IAddressRepository";

export class AddressRepository implements IAddressRepository {
  private ormRepo: Repository<Address>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Address);
  }

  async create(data: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepo.create(data);
    return this.ormRepo.save(address);
  }

  private mapRawToItem(raw: any): AddressListItem {
    return {
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
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("a")
      .innerJoin("a.city", "c")
      .innerJoin("c.state", "s")
      .select([
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
    city_id,
  }: PaginateParams): Promise<AddressesPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("a.street", "ASC");

    if (city_id) {
      qb.andWhere("a.city_id = :city_id", { city_id });
    }

    if (search?.trim()) {
      qb.andWhere(
        "(a.street LIKE :search OR a.neighborhood LIKE :search OR a.cep LIKE :search)",
        { search: `%${search.trim()}%` }
      );
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

  async findById(id: number): Promise<Address | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: number): Promise<AddressListItem | null> {
    const raw = await this.baseQuery()
      .where("a.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update({ id, ...data }: IUpdateAddressDTO): Promise<Address> {
    await this.ormRepo.update({ id }, data);
    return this.findById(id) as Promise<Address>;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
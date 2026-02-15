import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Address } from "../entities/Address";
import {
  IAddressRepository,
  ICreateAddressDTO,
  IUpdateAddressDTO,
  PaginateParams,
  AddressesPaginateProperties,
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

  async findAll({
    search,
    page,
    skip,
    take,
    city_id,
  }: PaginateParams): Promise<AddressesPaginateProperties> {
    const where: any = {};

    if (city_id) where.city_id = city_id;

    if (search?.trim()) {
      where.street = Like(`%${search.trim()}%`);
    }

    const [data, total] = await this.ormRepo.findAndCount({
      where,
      order: { street: "ASC" },
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

  async findById(id: number): Promise<Address | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async update(data: IUpdateAddressDTO): Promise<Address> {
    await this.ormRepo.update({ id: data.id }, data);
    return (await this.findById(data.id)) as Address;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
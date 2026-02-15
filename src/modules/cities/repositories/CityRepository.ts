import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { City } from "../entities/City";
import {
  ICityRepository,
  ICreateCityDTO,
  IUpdateCityDTO,
  PaginateParams,
  CitiesPaginateProperties,
} from "./ICityRepository";

export class CityRepository implements ICityRepository {
  private ormRepo: Repository<City>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(City);
  }

  async create({ state_id, name }: ICreateCityDTO): Promise<City> {
    const city = this.ormRepo.create({ state_id, name });
    return this.ormRepo.save(city);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    state_id,
  }: PaginateParams): Promise<CitiesPaginateProperties> {
    const where: any = {};

    if (state_id) where.state_id = state_id;

    if (search?.trim()) {
      where.name = Like(`%${search.trim()}%`);
    }

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

  async findById(id: number): Promise<City | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByNameInState(state_id: number, name: string): Promise<City | null> {
    return this.ormRepo.findOne({ where: { state_id, name } });
  }

  async countByStateId(state_id: number): Promise<number> {
    return this.ormRepo.count({ where: { state_id } });
  }

  async update({ id, state_id, name }: IUpdateCityDTO): Promise<City> {
    await this.ormRepo.update({ id }, { state_id, name });
    const updated = await this.findById(id);
    return updated as City;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { City } from "../entities/City";
import {
  ICityRepository,
  ICreateCityDTO,
  IUpdateCityDTO,
  PaginateParams,
  CitiesPaginateProperties,
  CityListItem,
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

  private mapRawToItem(raw: any): CityListItem {
    return {
      id: Number(raw.c_id),
      name: raw.c_name,
      state: {
        id: Number(raw.s_id),
        name: raw.s_name,
      },
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("c")
      .innerJoin("c.state", "s")
      .select([
        "c.id     as c_id",
        "c.name   as c_name",
        "s.id     as s_id",
        "s.name   as s_name",
      ]);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    state_id,
  }: PaginateParams): Promise<CitiesPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("c.name", "ASC")
      .skip(skip)
      .take(take);

    if (state_id) {
      qb.andWhere("c.state_id = :state_id", { state_id });
    }

    if (search?.trim()) {
      qb.andWhere("c.name LIKE :search", { search: `%${search.trim()}%` });
    }

    const [raw, total] = await Promise.all([
      qb.getRawMany(),
      qb.clone().skip(undefined as any).take(undefined as any).getCount(),
    ]);

    return {
      per_page: take,
      total,
      current_page: page,
      data: raw.map((item) => this.mapRawToItem(item)),
    };
  }

  async findById(id: number): Promise<City | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: number): Promise<CityListItem | null> {
    const raw = await this.baseQuery()
      .where("c.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async findByNameInState(state_id: number, name: string): Promise<City | null> {
    return this.ormRepo.findOne({ where: { state_id, name } });
  }

  async countByStateId(state_id: number): Promise<number> {
    return this.ormRepo.count({ where: { state_id } });
  }

  async update({ id, state_id, name }: IUpdateCityDTO): Promise<City> {
    await this.ormRepo.update({ id }, { state_id, name });
    return this.findById(id) as Promise<City>;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
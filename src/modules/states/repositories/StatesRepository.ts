import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { State } from "../entities/State";
import {
  IStatesRepository,
  ICreateStateDTO,
  IUpdateStateDTO,
  PaginateParams,
  StatesPaginateProperties,
} from "./IStatesRepository";

export class StatesRepository implements IStatesRepository {
  private ormRepo: Repository<State>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(State);
  }

  async create({ name }: ICreateStateDTO): Promise<State> {
    const state = this.ormRepo.create({ name });
    return this.ormRepo.save(state);
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<StatesPaginateProperties> {
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

  async findById(id: number): Promise<State | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<State | null> {
    return this.ormRepo.findOne({ where: { name } });
  }

  async update({ id, name }: IUpdateStateDTO): Promise<State> {
    await this.ormRepo.update({ id }, { name });
    const updated = await this.findById(id);
    return updated as State;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}

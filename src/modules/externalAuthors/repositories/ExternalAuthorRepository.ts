import { Like, Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ExternalAuthor } from "../entities/ExternalAuthor";
import {
  IExternalAuthorRepository,
  ICreateExternalAuthorDTO,
  IUpdateExternalAuthorDTO,
  PaginateParams,
  ExternalAuthorPaginateProperties,
} from "./IExternalAuthorRepository";

export class ExternalAuthorRepository implements IExternalAuthorRepository {
  private ormRepo: Repository<ExternalAuthor>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ExternalAuthor);
  }

  async create(data: ICreateExternalAuthorDTO): Promise<ExternalAuthor> {
    const externalAuthor = this.ormRepo.create(data);
    return this.ormRepo.save(externalAuthor);
  }

  async findAll({
    name,
    page,
    skip,
    take,
  }: PaginateParams): Promise<ExternalAuthorPaginateProperties> {
    const where = name?.trim()
      ? { name: Like(`%${name.trim()}%`) }
      : {};

    const [data, total] = await this.ormRepo.findAndCount({
      where,
      order: {
        name: "ASC",
      },
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

  async findById(id: number): Promise<ExternalAuthor | null> {
    return this.ormRepo.findOne({
      where: { id },
    });
  }

  async update(data: IUpdateExternalAuthorDTO): Promise<ExternalAuthor> {
    await this.ormRepo.update({ id: data.id }, data);
    const updated = await this.findById(data.id);
    return updated as ExternalAuthor;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
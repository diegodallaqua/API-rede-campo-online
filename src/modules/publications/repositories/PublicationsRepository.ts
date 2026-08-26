import { FindOptionsWhere, Like, Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Publication } from "../entities/Publication";
import {
  IPublicationRepository,
  ICreatePublicationDTO,
  IUpdatePublicationDTO,
  PaginateParams,
  PublicationPaginateProperties,
} from "./IPublicationRepository";

export class PublicationRepository implements IPublicationRepository {
  private ormRepo: Repository<Publication>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Publication);
  }

  async create(data: ICreatePublicationDTO): Promise<Publication> {
    const publication = this.ormRepo.create(data);
    return this.ormRepo.save(publication);
  }

  async findAll({
    title,
    project_id,
    page,
    skip,
    take,
  }: PaginateParams): Promise<PublicationPaginateProperties> {
    const where: FindOptionsWhere<Publication> = {};

    if (title?.trim()) {
      where.title = Like(`%${title.trim()}%`);
    }

    if (project_id !== undefined) {
      where.project_id = project_id;
    }

    const [data, total] = await this.ormRepo.findAndCount({
      where,
      relations: { project: { projectType: true } },
      order: {
        publication_date: "DESC",
        title: "ASC",
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

  async findById(id: number): Promise<Publication | null> {
    return this.ormRepo.findOne({
      where: { id },
      relations: { project: { projectType: true } },
    });
  }

  async findByDoi(doi: string): Promise<Publication | null> {
    return this.ormRepo.findOne({
      where: { doi },
    });
  }

  async update(data: IUpdatePublicationDTO): Promise<Publication> {
    await this.ormRepo.update({ id: data.id }, data);
    const updated = await this.findById(data.id);
    return updated as Publication;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { News } from "../entities/News";
import {
  INewsRepository,
  ICreateNewsDTO,
  IUpdateNewsDTO,
  PaginateParams,
  NewsPaginateProperties,
  NewsListItem,
} from "./INewsRepository";

export class NewsRepository implements INewsRepository {
  private ormRepo: Repository<News>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(News);
  }

  async create(data: ICreateNewsDTO): Promise<{ id: number }> {
    const entity = this.ormRepo.create(data);
    const saved = await this.ormRepo.save(entity);

    return { id: saved.id };
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): NewsListItem {
    return {
      id: Number(raw.n_id),
      title: raw.n_title,
      description: raw.n_description,
      content: raw.n_content,
      publication_date: raw.n_publication_date,
      project: raw.p_id
        ? {
            id: Number(raw.p_id),
            name: raw.p_name,
          }
        : null,
      member: {
        id: Number(raw.m_id),
        name: raw.m_name,
        email: raw.m_email,
      },
    };
  }

  private baseSelect(qb: any) {
    return qb.select([
      "n.id as n_id",
      "n.title as n_title",
      "n.description as n_description",
      "n.content as n_content",
      "n.publication_date as n_publication_date",

      "p.id as p_id",
      "p.name as p_name",

      "m.id as m_id",
      "m.name as m_name",
      "m.email as m_email",
    ]);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    project_id,
  }: PaginateParams): Promise<NewsPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("n")
      .leftJoin("n.project", "p")
      .innerJoin("n.member", "m");

    this.baseSelect(qb);

    qb.orderBy("n.publication_date", "DESC")
      .addOrderBy("n.title", "ASC")
      .skip(skip)
      .take(take);

    if (project_id) {
      qb.andWhere("n.project_id = :project_id", { project_id });
    }

    const trimmed = search?.trim();
    if (trimmed) {
      qb.andWhere(
        `(n.title LIKE :s OR n.description LIKE :s OR n.content LIKE :s OR m.name LIKE :s OR p.name LIKE :s)`,
        { s: `%${trimmed}%` }
      );
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

  async findByIdWithRelations(id: number): Promise<NewsListItem | null> {
    const qb = this.ormRepo
      .createQueryBuilder("n")
      .leftJoin("n.project", "p")
      .innerJoin("n.member", "m")
      .where("n.id = :id", { id });

    this.baseSelect(qb);

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateNewsDTO): Promise<void> {
    await this.ormRepo.update({ id: data.id }, data);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
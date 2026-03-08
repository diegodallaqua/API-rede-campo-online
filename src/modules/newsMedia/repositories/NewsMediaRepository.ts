import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { NewsMedia } from "../entities/NewsMedia";
import {
  INewsMediaRepository,
  ICreateNewsMediaDTO,
  IUpdateNewsMediaDTO,
  PaginateParams,
  NewsMediaPaginateProperties,
  NewsMediaListItem,
} from "./INewsMediaRepository";

export class NewsMediaRepository implements INewsMediaRepository {
  private ormRepo: Repository<NewsMedia>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(NewsMedia);
  }

  async create(data: ICreateNewsMediaDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): NewsMediaListItem {
    return {
      id: Number(raw.nm_id),
      name: raw.nm_name,
      media: raw.nm_media,
      news: {
        id: Number(raw.n_id),
        title: raw.n_title,
        description: raw.n_description,
        content: raw.n_content,
        publication_date: raw.n_publication_date,
        project: raw.p_id
          ? {
              id: Number(raw.p_id),
              name: raw.p_name,
              status: Boolean(raw.p_status),
            }
          : null,
      },
    };
  }

  private baseSelect(qb: any) {
    return qb.select([
      "nm.id as nm_id",
      "nm.name as nm_name",
      "nm.media as nm_media",

      "n.id as n_id",
      "n.title as n_title",
      "n.description as n_description",
      "n.content as n_content",
      "n.publication_date as n_publication_date",

      "p.id as p_id",
      "p.name as p_name",
      "p.status as p_status",
    ]);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    news_id,
  }: PaginateParams): Promise<NewsMediaPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("nm")
      .innerJoin("nm.news", "n")
      .leftJoin("n.project", "p");

    this.baseSelect(qb);

    qb.orderBy("nm.name", "ASC").skip(skip).take(take);

    if (news_id) {
      qb.andWhere("nm.news_id = :news_id", { news_id });
    }

    const trimmed = search?.trim();
    if (trimmed) {
      qb.andWhere(
        `(nm.name LIKE :s OR nm.media LIKE :s OR n.title LIKE :s OR n.description LIKE :s OR p.name LIKE :s)`,
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

  async findByIdWithRelations(id: number): Promise<NewsMediaListItem | null> {
    const qb = this.ormRepo
      .createQueryBuilder("nm")
      .innerJoin("nm.news", "n")
      .leftJoin("n.project", "p")
      .where("nm.id = :id", { id });

    this.baseSelect(qb);

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateNewsMediaDTO): Promise<void> {
    await this.ormRepo.update({ id: data.id }, data);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
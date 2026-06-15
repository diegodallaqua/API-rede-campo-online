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
      publication_date: new Date(raw.n_publication_date),

      member: {
        id: Number(raw.m_id),
        name: raw.m_name,
        email: raw.m_email,
        member_role: { id: Number(raw.mr_id), name: raw.mr_name },
        organization: { id: Number(raw.o_id), name: raw.o_name },
        profile_picture: raw.m_profile_picture ?? null,
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

      "m.id as m_id",
      "m.name as m_name",
      "m.email as m_email",
      "m.profile_picture as m_profile_picture",

      "mr.id as mr_id",
      "mr.name as mr_name",

      "o.id as o_id",
      "o.name as o_name",
    ]);
  }

  async findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<NewsPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("n")
      .innerJoin("n.member", "m")
      .innerJoin("m.memberRole", "mr")
      .innerJoin("m.organization", "o");

    this.baseSelect(qb);

    qb.orderBy("n.publication_date", "DESC")
      .addOrderBy("n.title", "ASC");

    const trimmed = search?.trim();

    if (trimmed) {
      qb.andWhere(
        `(n.title LIKE :s OR n.description LIKE :s OR n.content LIKE :s OR m.name LIKE :s)`,
        { s: `%${trimmed}%` }
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

  async findByIdWithRelations(id: number): Promise<NewsListItem | null> {
    const qb = this.ormRepo
      .createQueryBuilder("n")
      .innerJoin("n.member", "m")
      .innerJoin("m.memberRole", "mr")
      .innerJoin("m.organization", "o")
      .where("n.id = :id", { id });

    this.baseSelect(qb);

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateNewsDTO): Promise<void> {
    const { id, ...updateData } = data;

    await this.ormRepo.update({ id }, updateData);
  }

  async delete(id: number): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      await manager.query(
        `DELETE FROM newshasresearcharea WHERE news_id = ?`,
        [id]
      );

      await manager.delete(News, { id });
    });
  }
}
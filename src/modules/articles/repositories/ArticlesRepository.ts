import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Article } from "../entities/Article";
import {
  IArticleRepository,
  ICreateArticleDTO,
  IUpdateArticleDTO,
  PaginateParams,
  ArticlePaginateProperties,
  ArticleListItem,
} from "./IArticleRepository";

export class ArticleRepository implements IArticleRepository {
  private ormRepo: Repository<Article>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Article);
  }

  async create(data: ICreateArticleDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsByPublicationId(publication_id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { publication_id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): ArticleListItem {
    return {
      publication_id: Number(raw.a_publication_id),
      journal_name: raw.a_journal_name,
      volume: raw.a_volume ?? null,
      issue: raw.a_issue ?? null,
      pages: raw.a_pages ?? null,
      publisher: raw.a_publisher ?? null,
      publication: {
        id: Number(raw.p_id),
        title: raw.p_title,
        abstract: raw.p_abstract,
        publication_date: raw.p_publication_date,
        doi: raw.p_doi ?? null,
      },
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("a")
      .innerJoin("a.publication", "p")
      .select([
        "a.publication_id as a_publication_id",
        "a.journal_name as a_journal_name",
        "a.volume as a_volume",
        "a.issue as a_issue",
        "a.pages as a_pages",
        "a.publisher as a_publisher",

        "p.id as p_id",
        "p.title as p_title",
        "p.abstract as p_abstract",
        "p.publication_date as p_publication_date",
        "p.doi as p_doi",
      ]);
  }

  async findAll({
    title,
    page,
    skip,
    take,
  }: PaginateParams): Promise<ArticlePaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("p.id", "ASC")
      .addOrderBy("p.publication_date", "ASC")
      .skip(skip)
      .take(take);

    const trimmed = title?.trim();
    if (trimmed) {
      qb.andWhere("(p.title LIKE :t OR a.journal_name LIKE :t)", {
        t: `%${trimmed}%`,
      });
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

  async findByIdWithRelations(publication_id: number): Promise<ArticleListItem | null> {
    const qb = this.baseQuery().where("a.publication_id = :publication_id", {
      publication_id,
    });

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateArticleDTO): Promise<void> {
    await this.ormRepo.update(
      { publication_id: data.publication_id },
      {
        journal_name: data.journal_name,
        volume: data.volume ?? null,
        issue: data.issue ?? null,
        pages: data.pages ?? null,
        publisher: data.publisher ?? null,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}
import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Book } from "../entities/Book";
import {
  IBookRepository,
  ICreateBookDTO,
  IUpdateBookDTO,
  PaginateParams,
  BookPaginateProperties,
  BookListItem,
} from "./IBookRepository";

export class BookRepository implements IBookRepository {
  private ormRepo: Repository<Book>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Book);
  }

  async create(data: ICreateBookDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsByPublicationId(publication_id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { publication_id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): BookListItem {
    return {
      publication_id: Number(raw.b_publication_id),
      publisher: raw.b_publisher,
      edition: raw.b_edition,
      cover_photo: raw.b_cover_photo ?? null,
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
      .createQueryBuilder("b")
      .innerJoin("b.publication", "p")
      .select([
        "b.publication_id as b_publication_id",
        "b.publisher as b_publisher",
        "b.edition as b_edition",
        "b.cover_photo as b_cover_photo",

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
  }: PaginateParams): Promise<BookPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("p.publication_date", "DESC")
      .addOrderBy("p.title", "ASC")
      .skip(skip)
      .take(take);

    const trimmed = title?.trim();
    if (trimmed) {
      qb.andWhere("(p.title LIKE :t OR b.publisher LIKE :t OR b.edition LIKE :t)", {
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

  async findByIdWithRelations(publication_id: number): Promise<BookListItem | null> {
    const qb = this.baseQuery().where("b.publication_id = :publication_id", {
      publication_id,
    });

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateBookDTO): Promise<void> {
    await this.ormRepo.update(
      { publication_id: data.publication_id },
      {
        publisher: data.publisher,
        edition: data.edition,
        cover_photo: data.cover_photo ?? null,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}
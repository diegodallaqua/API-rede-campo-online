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
      publisher: raw.b_publisher,
      edition: raw.b_edition,
      cover_photo: raw.b_cover_photo ?? null,
      isbn: raw.b_isbn,
      book_url: raw.b_book_url ?? null,
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
        "b.publisher as b_publisher",
        "b.edition as b_edition",
        "b.cover_photo as b_cover_photo",
        "b.isbn as b_isbn",
        "b.book_url as b_book_url",

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
      .orderBy("p.id", "ASC")
      .addOrderBy("p.publication_date", "ASC");

    const trimmed = title?.trim();
    if (trimmed) {
      qb.andWhere("(p.title LIKE :t OR b.publisher LIKE :t OR b.edition LIKE :t)", {
        t: `%${trimmed}%`,
      });
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
        isbn: data.isbn,
        book_url: data.book_url ?? null,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}
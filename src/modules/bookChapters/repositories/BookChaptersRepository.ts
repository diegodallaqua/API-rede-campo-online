import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { BookChapter } from "../entities/BookChapter";
import {
  IBookChapterRepository,
  ICreateBookChapterDTO,
  IUpdateBookChapterDTO,
  PaginateParams,
  BookChapterPaginateProperties,
  BookChapterListItem,
} from "./IBookChapterRepository";

export class BookChapterRepository implements IBookChapterRepository {
  private ormRepo: Repository<BookChapter>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(BookChapter);
  }

  async create(data: ICreateBookChapterDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsByPublicationId(publication_id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { publication_id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): BookChapterListItem {
    return {
      book_name: raw.bc_book_name,
      chapter_number: Number(raw.bc_chapter_number),
      isbn: raw.bc_isbn ?? null,
      start_page: raw.bc_start_page,
      end_page: raw.bc_end_page,
      publication: {
        id: Number(raw.p_id),
        title: raw.p_title,
        abstract: raw.p_abstract,
        publication_date: raw.p_publication_date,
        doi: raw.p_doi ?? null,
      },
      book:
        raw.b_id !== null && raw.b_id !== undefined
          ? {
              id: Number(raw.b_id),
              publisher: raw.b_publisher,
              edition: raw.b_edition,
              isbn: raw.b_isbn,
              publication: {
                id: Number(raw.bp_id),
                title: raw.bp_title,
                abstract: raw.bp_abstract,
                publication_date: raw.bp_publication_date,
                doi: raw.bp_doi ?? null,
              },
            }
          : null,
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("bc")
      .innerJoin("bc.publication", "p")
      .leftJoin("bc.book", "b")
      .leftJoin("b.publication", "bp")
      .select([
        "bc.book_name as bc_book_name",
        "bc.chapter_number as bc_chapter_number",
        "bc.isbn as bc_isbn",
        "bc.start_page as bc_start_page",
        "bc.end_page as bc_end_page",

        "p.id as p_id",
        "p.title as p_title",
        "p.abstract as p_abstract",
        "p.publication_date as p_publication_date",
        "p.doi as p_doi",

        "b.publication_id as b_id",
        "b.publisher as b_publisher",
        "b.edition as b_edition",
        "b.isbn as b_isbn",

        "bp.id as bp_id",
        "bp.title as bp_title",
        "bp.abstract as bp_abstract",
        "bp.publication_date as bp_publication_date",
        "bp.doi as bp_doi",
      ]);
  }

  async findAll({
    title,
    book_id,
    page,
    skip,
    take,
  }: PaginateParams): Promise<BookChapterPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("p.id", "ASC")
      .addOrderBy("p.publication_date", "ASC");

    if (book_id) {
      qb.andWhere("bc.book_id = :book_id", { book_id });
    }

    const trimmed = title?.trim();
    if (trimmed) {
      qb.andWhere("(p.title LIKE :t OR bc.book_name LIKE :t)", {
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

  async findByIdWithRelations(publication_id: number): Promise<BookChapterListItem | null> {
    const qb = this.baseQuery().where("bc.publication_id = :publication_id", {
      publication_id,
    });

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateBookChapterDTO): Promise<void> {
    await this.ormRepo.update(
      { publication_id: data.publication_id },
      {
        book_id: data.book_id ?? null,
        book_name: data.book_name,
        chapter_number: data.chapter_number,
        isbn: data.isbn ?? null,
        start_page: data.start_page,
        end_page: data.end_page,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}

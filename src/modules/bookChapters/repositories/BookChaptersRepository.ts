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
      .createQueryBuilder("bc")
      .innerJoin("bc.publication", "p")
      .select([
        "bc.book_name as bc_book_name",
        "bc.chapter_number as bc_chapter_number",

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
  }: PaginateParams): Promise<BookChapterPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("p.id", "ASC")
      .addOrderBy("p.publication_date", "ASC")
      .skip(skip)
      .take(take);

    const trimmed = title?.trim();
    if (trimmed) {
      qb.andWhere("(p.title LIKE :t OR bc.book_name LIKE :t)", {
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
        book_name: data.book_name,
        chapter_number: data.chapter_number,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}
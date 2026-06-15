import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Thesis } from "../entities/Thesis";
import {
  IThesisRepository,
  ICreateThesisDTO,
  IUpdateThesisDTO,
  PaginateParams,
  ThesisPaginateProperties,
  ThesisListItem,
} from "./IThesisRepository";

export class ThesisRepository implements IThesisRepository {
  private ormRepo: Repository<Thesis>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Thesis);
  }

  async create(data: ICreateThesisDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsByPublicationId(publication_id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { publication_id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): ThesisListItem {
    return {
      number_of_pages: Number(raw.tr_number_of_pages),

      publication: {
        id: Number(raw.p_id),
        title: raw.p_title,
        abstract: raw.p_abstract,
        publication_date: raw.p_publication_date,
        doi: raw.p_doi ?? null,
      },

      organization: {
        id: Number(raw.o_id),
        name: raw.o_name,
        logo: raw.o_logo,
      },
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("tr")
      .innerJoin("tr.publication", "p")
      .innerJoin("tr.organization", "o")
      .select([
        "tr.number_of_pages as tr_number_of_pages",

        "p.id as p_id",
        "p.title as p_title",
        "p.abstract as p_abstract",
        "p.publication_date as p_publication_date",
        "p.doi as p_doi",

        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",
      ]);
  }

  async findAll({
    title,
    organization_id,
    page,
    skip,
    take,
  }: PaginateParams): Promise<ThesisPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("p.title", "ASC")
      .addOrderBy("p.publication_date", "DESC");

    if (organization_id) {
      qb.andWhere("tr.organization_id = :organization_id", { organization_id });
    }

    const trimmed = title?.trim();
    if (trimmed) {
      qb.andWhere("(p.title LIKE :t OR o.name LIKE :t)", {
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

  async findByIdWithRelations(publication_id: number): Promise<ThesisListItem | null> {
    const qb = this.baseQuery().where("tr.publication_id = :publication_id", {
      publication_id,
    });

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateThesisDTO): Promise<void> {
    await this.ormRepo.update(
      { publication_id: data.publication_id },
      {
        organization_id: data.organization_id,
        number_of_pages: data.number_of_pages,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}

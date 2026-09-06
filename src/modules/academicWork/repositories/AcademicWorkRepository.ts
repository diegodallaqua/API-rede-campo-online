import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { AcademicWork } from "../entities/AcademicWork";
import {
  IAcademicWorkRepository,
  ICreateAcademicWorkDTO,
  IUpdateAcademicWorkDTO,
  PaginateParams,
  AcademicWorkPaginateProperties,
  AcademicWorkListItem,
} from "./IAcademicWorkRepository";

export class AcademicWorkRepository implements IAcademicWorkRepository {
  private ormRepo: Repository<AcademicWork>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(AcademicWork);
  }

  async create(data: ICreateAcademicWorkDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsByPublicationId(publication_id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { publication_id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): AcademicWorkListItem {
    return {
      number_of_pages: Number(raw.aw_number_of_pages),
      defense_date: raw.aw_defense_date,

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

      academic_work_type: {
        id: Number(raw.awt_id),
        name: raw.awt_name,
        degree_level: raw.awt_degree_level,
      },
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("aw")
      .innerJoin("aw.publication", "p")
      .innerJoin("aw.organization", "o")
      .innerJoin("aw.academic_work_type", "awt")
      .select([
        "aw.number_of_pages as aw_number_of_pages",
        "aw.defense_date as aw_defense_date",

        "p.id as p_id",
        "p.title as p_title",
        "p.abstract as p_abstract",
        "p.publication_date as p_publication_date",
        "p.doi as p_doi",

        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",

        "awt.id as awt_id",
        "awt.name as awt_name",
        "awt.degree_level as awt_degree_level",
      ]);
  }

  async findAll({
    title,
    organization_id,
    academic_work_type_id,
    page,
    skip,
    take,
  }: PaginateParams): Promise<AcademicWorkPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("p.title", "ASC")
      .addOrderBy("p.publication_date", "DESC");

    if (organization_id) {
      qb.andWhere("aw.organization_id = :organization_id", { organization_id });
    }

    if (academic_work_type_id) {
      qb.andWhere("aw.academic_work_type_id = :academic_work_type_id", {
        academic_work_type_id,
      });
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

  async findByIdWithRelations(publication_id: number): Promise<AcademicWorkListItem | null> {
    const qb = this.baseQuery().where("aw.publication_id = :publication_id", {
      publication_id,
    });

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateAcademicWorkDTO): Promise<void> {
    await this.ormRepo.update(
      { publication_id: data.publication_id },
      {
        organization_id: data.organization_id,
        academic_work_type_id: data.academic_work_type_id,
        defense_date: data.defense_date,
        number_of_pages: data.number_of_pages,
      }
    );
  }

  async delete(publication_id: number): Promise<void> {
    await this.ormRepo.delete({ publication_id });
  }
}

import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { PublicationContributor } from "../entities/PublicationContributor";
import {
  IPublicationContributorRepository,
  ICreatePublicationContributorDTO,
  IUpdatePublicationContributorDTO,
  PaginateParams,
  PublicationContributorPaginateProperties,
  PublicationContributorListItem,
} from "./IPublicationContributorRepository";

export class PublicationContributorRepository
  implements IPublicationContributorRepository
{
  private ormRepo: Repository<PublicationContributor>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(PublicationContributor);
  }

  async create(data: ICreatePublicationContributorDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsById(publication_id: number, author_order: number): Promise<boolean> {
    const count = await this.ormRepo.count({
      where: { publication_id, author_order },
    });

    return count > 0;
  }

  async findByPublicationAndAuthorOrder(publication_id: number, author_order: number) {
    const row = await this.ormRepo.findOne({
      where: { publication_id, author_order },
      select: {
        publication_id: true,
        author_order: true,
        member_id: true,
        external_author_id: true,
        contributor_role_id: true,
      },
    });

    return row
      ? {
          publication_id: row.publication_id,
          author_order: row.author_order,
          member_id: row.member_id ?? null,
          external_author_id: row.external_author_id ?? null,
          contributor_role_id: row.contributor_role_id,
        }
      : null;
  }

  async findMemberConflict(
    publication_id: number,
    member_id: number,
    contributor_role_id: number
  ): Promise<boolean> {
    const count = await this.ormRepo.count({
      where: {
        publication_id,
        member_id,
        contributor_role_id,
      },
    });

    return count > 0;
  }

  async findExternalAuthorConflict(
    publication_id: number,
    external_author_id: number,
    contributor_role_id: number
  ): Promise<boolean> {
    const count = await this.ormRepo.count({
      where: {
        publication_id,
        external_author_id,
        contributor_role_id,
      },
    });

    return count > 0;
  }

  private mapRawToItem(raw: any): PublicationContributorListItem {
    return {
      publication_id: Number(raw.pc_publication_id),
      author_order: Number(raw.pc_author_order),

      publication: {
        id: Number(raw.p_id),
        title: raw.p_title,
        publication_date: raw.p_publication_date,
        doi: raw.p_doi ?? null,
      },

      contributorRole: {
        id: Number(raw.cr_id),
        name: raw.cr_name,
      },

      member: raw.m_id
        ? {
            id: Number(raw.m_id),
            name: raw.m_name,
            email: raw.m_email,
          }
        : null,

      externalAuthor: raw.ea_id
        ? {
            id: Number(raw.ea_id),
            name: raw.ea_name,
            email: raw.ea_email ?? null,
            orcid: raw.ea_orcid ?? null,
          }
        : null,
    };
  }

  private baseQuery() {
    return this.ormRepo
      .createQueryBuilder("pc")
      .innerJoin("pc.publication", "p")
      .innerJoin("pc.contributorRole", "cr")
      .leftJoin("pc.member", "m")
      .leftJoin("pc.externalAuthor", "ea")
      .select([
        "pc.publication_id as pc_publication_id",
        "pc.author_order as pc_author_order",

        "p.id as p_id",
        "p.title as p_title",
        "p.publication_date as p_publication_date",
        "p.doi as p_doi",

        "cr.id as cr_id",
        "cr.name as cr_name",

        "m.id as m_id",
        "m.name as m_name",
        "m.email as m_email",

        "ea.id as ea_id",
        "ea.name as ea_name",
        "ea.email as ea_email",
        "ea.orcid as ea_orcid",
      ]);
  }

  async findAll({
    publication_id,
    page,
    skip,
    take,
  }: PaginateParams): Promise<PublicationContributorPaginateProperties> {
    const qb = this.baseQuery()
      .orderBy("pc.publication_id", "ASC")
      .addOrderBy("pc.author_order", "ASC")
      .skip(skip)
      .take(take);

    if (publication_id) {
      qb.andWhere("pc.publication_id = :publication_id", { publication_id });
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

  async findByIdWithRelations(publication_id: number, author_order: number) {
    const qb = this.baseQuery().where(
      "pc.publication_id = :publication_id AND pc.author_order = :author_order",
      { publication_id, author_order }
    );

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdatePublicationContributorDTO): Promise<void> {
    await this.ormRepo.update(
      {
        publication_id: data.publication_id,
        author_order: data.current_author_order,
      },
      {
        member_id: data.member_id ?? null,
        external_author_id: data.external_author_id ?? null,
        contributor_role_id: data.contributor_role_id,
        author_order: data.author_order,
      }
    );
  }

  async delete(publication_id: number, author_order: number): Promise<void> {
    await this.ormRepo.delete({
      publication_id,
      author_order,
    });
  }
}
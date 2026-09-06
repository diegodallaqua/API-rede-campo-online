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
  PublicationContributorEmbedItem,
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
            profile_picture: raw.m_profile_picture ?? null,
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
        "m.profile_picture as m_profile_picture",

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
      .addOrderBy("pc.author_order", "ASC");

    if (publication_id) {
      qb.andWhere("pc.publication_id = :publication_id", { publication_id });
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

  async findByIdWithRelations(publication_id: number, author_order: number) {
    const qb = this.baseQuery().where(
      "pc.publication_id = :publication_id AND pc.author_order = :author_order",
      { publication_id, author_order }
    );

    const raw = await qb.getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async findByPublicationId(publication_id: number): Promise<PublicationContributorEmbedItem[]> {
    const rows = await this.ormRepo
      .createQueryBuilder("pc")
      .innerJoin("pc.contributorRole", "cr")
      .leftJoin("pc.member", "m")
      .leftJoin("m.memberRole", "mr")
      .leftJoin("m.organization", "o")
      .leftJoin("pc.externalAuthor", "ea")
      .select([
        "pc.author_order as pc_author_order",
        "cr.id as cr_id",
        "cr.name as cr_name",
        "m.id as m_id",
        "m.name as m_name",
        "m.email as m_email",
        "m.description as m_description",
        "m.lattes_url as m_lattes_url",
        "m.linked_in_url as m_linked_in_url",
        "m.instagram_url as m_instagram_url",
        "m.profile_picture as m_profile_picture",
        "mr.id as mr_id",
        "mr.name as mr_name",
        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",
        "o.address_id as o_address_id",
        "ea.id as ea_id",
        "ea.name as ea_name",
        "ea.email as ea_email",
        "ea.orcid as ea_orcid",
      ])
      .where("pc.publication_id = :publication_id", { publication_id })
      .orderBy("pc.author_order", "ASC")
      .getRawMany();

    return rows.map((raw) => ({
      author_order: Number(raw.pc_author_order),
      contributor_role: { id: Number(raw.cr_id), name: raw.cr_name },
      member: raw.m_id
        ? {
            id: Number(raw.m_id),
            name: raw.m_name,
            email: raw.m_email,
            description: raw.m_description,
            lattes_url: raw.m_lattes_url ?? null,
            linked_in_url: raw.m_linked_in_url ?? null,
            instagram_url: raw.m_instagram_url ?? null,
            profile_picture: raw.m_profile_picture ?? null,
            member_role: { id: Number(raw.mr_id), name: raw.mr_name },
            organization: {
              id: Number(raw.o_id),
              name: raw.o_name,
              logo: raw.o_logo,
              address_id: Number(raw.o_address_id),
            },
          }
        : null,
      external_author: raw.ea_id
        ? {
            id: Number(raw.ea_id),
            name: raw.ea_name,
            email: raw.ea_email ?? null,
            orcid: raw.ea_orcid ?? null,
          }
        : null,
    }));
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
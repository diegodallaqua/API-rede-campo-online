import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Member } from "../entities/Member";
import {
  IMemberRepository,
  ICreateMemberDTO,
  IUpdateMemberDTO,
  PaginateParams,
  MembersPaginateProperties,
  MemberListItem,
  MemberAuthPayload
} from "./IMemberRepository";

export class MemberRepository implements IMemberRepository {
  private ormRepo: Repository<Member>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Member);
  }

  async create(data: ICreateMemberDTO): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }


  async findByEmail(email: string): Promise<{ id: number; email: string } | null> {
    const row = await this.ormRepo
      .createQueryBuilder("m")
      .select(["m.id as id", "m.email as email"])
      .where("m.email = :email", { email })
      .getRawOne();
    return row ? { id: Number(row.id), email: row.email } : null;
  }

  private mapRawToItem(raw: any): MemberListItem {
    return {
      id: Number(raw.m_id),
      name: raw.m_name,
      email: raw.m_email,
      description: raw.m_description,
      lattes_url: raw.m_lattes_url ?? null,
      linked_in_url: raw.m_linked_in_url ?? null,
      profile_picture: raw.m_profile_picture ?? null,

      member_role: {
        id: Number(raw.r_id),
        name: raw.r_name,
      },

      organization: {
        id: Number(raw.o_id),
        name: raw.o_name,
        logo: raw.o_logo,
        address_id: Number(raw.o_address_id),
      },
    };
  }

  async findAll({
    search,
    page,
    skip,
    take,
    member_role_id,
    organization_id,
  }: PaginateParams): Promise<MembersPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("m")
      .innerJoin("m.memberRole", "r")
      .innerJoin("m.organization", "o")
      .select([
        "m.id as m_id",
        "m.name as m_name",
        "m.email as m_email",
        "m.description as m_description",
        "m.lattes_url as m_lattes_url",
        "m.linked_in_url as m_linked_in_url",
        "m.profile_picture as m_profile_picture",

        "r.id as r_id",   
        "r.name as r_name",

        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",
        "o.address_id as o_address_id",
      ])  
      .orderBy("m.name", "ASC");

    if (member_role_id) qb.andWhere("m.member_role_id = :rid", { rid: member_role_id });
    if (organization_id) qb.andWhere("m.organization_id = :oid", { oid: organization_id });

    const trimmed = search?.trim();
    if (trimmed) {
      const digits = trimmed.replace(/\D/g, "");
      qb.andWhere(
        "(m.name LIKE :s OR m.email LIKE :s OR r.name LIKE :s OR o.name LIKE :s)",
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
      data: raw.map((r) => this.mapRawToItem(r)),
    };
  }

  async findByIdWithRelations(id: number): Promise<MemberListItem | null> {
    const raw = await this.ormRepo
      .createQueryBuilder("m")
      .innerJoin("m.memberRole", "r")
      .innerJoin("m.organization", "o")
      .select([
        "m.id as m_id",
        "m.member_role_id as m_member_role_id",
        "m.organization_id as m_organization_id",
        "m.name as m_name",
        "m.email as m_email",
        "m.description as m_description",
        "m.lattes_url as m_lattes_url",
        "m.linked_in_url as m_linked_in_url",
        "m.profile_picture as m_profile_picture",
        "r.name as r_name",
        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",
        "o.address_id as o_address_id",
      ])
      .where("m.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateMemberDTO): Promise<void> {
    await this.ormRepo.update({ id: data.id }, data);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  async findByEmailWithPassword(email: string): Promise<MemberAuthPayload | null> {
    const raw = await this.ormRepo
      .createQueryBuilder("m")
      .innerJoin("m.memberRole", "r")
      .innerJoin("m.organization", "o")
      .addSelect("m.password")
      .select([
        "m.id as m_id",
        "m.name as m_name",
        "m.email as m_email",
        "m.password as m_password",

        "r.id as r_id",
        "r.name as r_name",

        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",
        "o.address_id as o_address_id",
      ])
      .where("m.email = :email", { email })
      .getRawOne();

    if (!raw) return null;

    return {
      id: Number(raw.m_id),
      name: raw.m_name,
      email: raw.m_email,
      password: raw.m_password,
      member_role: { id: Number(raw.r_id), name: raw.r_name },
      organization: {
        id: Number(raw.o_id),
        name: raw.o_name,
        logo: raw.o_logo,
        address_id: Number(raw.o_address_id),
      },
    };
  }
}
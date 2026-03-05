import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Event } from "../entities/Event";
import {
  IEventRepository,
  PaginateParams,
  EventsPaginateProperties,
  EventListItem,
} from "./IEventRepository";

export class EventRepository implements IEventRepository {
  private ormRepo: Repository<Event>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Event);
  }

  async create(data: {
    address_id: number;
    project_id: number;
    name: string;
    date: Date;
    description?: string | null;
    registration_url?: string | null;
  }): Promise<void> {
    const entity = this.ormRepo.create(data);
    await this.ormRepo.save(entity);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): EventListItem {
    return {
      id: Number(raw.e_id),
      name: raw.e_name,
      date: new Date(raw.e_date).toISOString(),
      description: raw.e_description ?? null,
      registration_url: raw.e_registration_url ?? null,

      project: {
        id: Number(raw.p_id),
        name: raw.p_name,
        description: raw.p_description,
        status: Boolean(raw.p_status),
        begin_date: raw.p_begin_date,
        end_date: raw.p_end_date ?? null,
        external_staff: raw.p_external_staff ?? null,
        projectType: {
          id: Number(raw.pt_id),
          name: raw.pt_name,
        },
      },

      address: {
        id: Number(raw.a_id),
        street: raw.a_street,
        neighborhood: raw.a_neighborhood,
        number: Number(raw.a_number),
        cep: raw.a_cep,
        complement: raw.a_complement ?? null,
        city: {
          id: Number(raw.c_id),
          name: raw.c_name,
          state: {
            id: Number(raw.s_id),
            name: raw.s_name,
          },
        },
      },
    };
  }

  private baseSelect(qb: any) {
    return qb.select([
      // event
      "e.id as e_id",
      "e.name as e_name",
      "e.date as e_date",
      "e.description as e_description",
      "e.registration_url as e_registration_url",

      // project
      "p.id as p_id",
      "p.name as p_name",
      "p.description as p_description",
      "p.status as p_status",
      "p.begin_date as p_begin_date",
      "p.end_date as p_end_date",
      "p.external_staff as p_external_staff",

      // projectType
      "pt.id as pt_id",
      "pt.name as pt_name",

      // address
      "a.id as a_id",
      "a.street as a_street",
      "a.neighborhood as a_neighborhood",
      "a.number as a_number",
      "a.cep as a_cep",
      "a.complement as a_complement",

      // city
      "c.id as c_id",
      "c.name as c_name",

      // state
      "s.id as s_id",
      "s.name as s_name",
    ]);
  }

  async findAll({
    search,
    page,
    skip,
    take,
    project_id,
  }: PaginateParams): Promise<EventsPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("e")
      .innerJoin("e.project", "p")
      .innerJoin("p.projectType", "pt")
      .innerJoin("e.address", "a")
      .innerJoin("a.city", "c")
      .innerJoin("c.state", "s");

    this.baseSelect(qb);

    qb.orderBy("e.date", "DESC").skip(skip).take(take);

    if (project_id) {
      qb.andWhere("e.project_id = :pid", { pid: project_id });
    }

    const trimmed = search?.trim();
    if (trimmed) {
      qb.andWhere(
        `(e.name LIKE :s OR e.description LIKE :s OR p.name LIKE :s OR a.street LIKE :s OR c.name LIKE :s OR s.name LIKE :s)`,
        { s: `%${trimmed}%` }
      );
    }

    const [raw, total] = await Promise.all([
      qb.getRawMany(),
      qb.clone().skip(undefined as any).take(undefined as any).getCount(),
    ]);

    return {
      per_page: take,
      total,
      current_page: page,
      data: raw.map((r) => this.mapRawToItem(r)),
    };
  }

  async findByIdWithRelations(id: number): Promise<EventListItem | null> {
    const qb = this.ormRepo
      .createQueryBuilder("e")
      .innerJoin("e.project", "p")
      .innerJoin("p.projectType", "pt")
      .innerJoin("e.address", "a")
      .innerJoin("a.city", "c")
      .innerJoin("c.state", "s")
      .where("e.id = :id", { id });

    this.baseSelect(qb);

    const raw = await qb.getRawOne();
    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: {
    id: number;
    address_id: number;
    project_id: number;
    name: string;
    date: Date;
    description?: string | null;
    registration_url?: string | null;
  }): Promise<void> {
    await this.ormRepo.update({ id: data.id }, data);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
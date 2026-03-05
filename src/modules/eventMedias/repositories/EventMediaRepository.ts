import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { EventMedia } from "../entities/EventMedia";
import {
  IEventMediaRepository,
  ICreateEventMediaDTO,
  IUpdateEventMediaDTO,
  PaginateParams,
  EventMediaPaginateProperties,
  EventMediaListItem,
} from "./IEventMediaRepository";

export class EventMediaRepository implements IEventMediaRepository {
  private ormRepo: Repository<EventMedia>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(EventMedia);
  }

  async create(data: ICreateEventMediaDTO): Promise<void> {
    const entity = this.ormRepo.create({
      event_id: data.event_id,
      name: data.name,
      media: data.media,
    });
    await this.ormRepo.save(entity);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): EventMediaListItem {
    return {
      id: Number(raw.em_id),
      name: raw.em_name,
      media: raw.em_media,

      event: {
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
      },
    };
  }

  async findAll({
  search,
  page,
  skip,
  take,
  event_id,
  }: PaginateParams): Promise<EventMediaPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("em")
      .innerJoin("em.event", "e")
      .innerJoin("e.project", "p")
      .innerJoin("p.projectType", "pt")
      .innerJoin("e.address", "a")
      .innerJoin("a.city", "c")
      .innerJoin("c.state", "s")
      .select([
        // eventMedia
        "em.id as em_id",
        "em.name as em_name",
        "em.media as em_media",

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
      ])
      .orderBy("em.name", "ASC")
      .skip(skip)
      .take(take);

    if (event_id) {
      qb.andWhere("em.event_id = :eid", { eid: event_id });
    }

    const trimmed = search?.trim();
    if (trimmed) {
      qb.andWhere(
        `(em.name LIKE :s OR em.media LIKE :s OR e.name LIKE :s OR p.name LIKE :s OR c.name LIKE :s OR s.name LIKE :s)`,
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

  async findByIdWithEvent(id: number): Promise<EventMediaListItem | null> {
    const raw = await this.ormRepo
      .createQueryBuilder("em")
      .innerJoin("em.event", "e")
      .innerJoin("e.project", "p")
      .innerJoin("p.projectType", "pt")
      .innerJoin("e.address", "a")
      .innerJoin("a.city", "c")
      .innerJoin("c.state", "s")
      .select([
        "em.id as em_id",
        "em.name as em_name",
        "em.media as em_media",

        "e.id as e_id",
        "e.name as e_name",
        "e.date as e_date",
        "e.description as e_description",
        "e.registration_url as e_registration_url",

        "p.id as p_id",
        "p.name as p_name",
        "p.description as p_description",
        "p.status as p_status",
        "p.begin_date as p_begin_date",
        "p.end_date as p_end_date",
        "p.external_staff as p_external_staff",

        "pt.id as pt_id",
        "pt.name as pt_name",

        "a.id as a_id",
        "a.street as a_street",
        "a.neighborhood as a_neighborhood",
        "a.number as a_number",
        "a.cep as a_cep",
        "a.complement as a_complement",

        "c.id as c_id",
        "c.name as c_name",

        "s.id as s_id",
        "s.name as s_name",
      ])
      .where("em.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateEventMediaDTO): Promise<void> {
    await this.ormRepo.update(
      { id: data.id },
      { event_id: data.event_id, name: data.name, media: data.media }
    );
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
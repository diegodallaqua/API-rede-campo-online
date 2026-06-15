import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ProjectMedia } from "../entities/ProjectMedia";
import {
  IProjectMediaRepository,
  ICreateProjectMediaDTO,
  IUpdateProjectMediaDTO,
  PaginateParams,
  ProjectMediaPaginateProperties,
  ProjectMediaListItem,
} from "./IProjectMediaRepository";

export class ProjectMediaRepository implements IProjectMediaRepository {
  private ormRepo: Repository<ProjectMedia>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ProjectMedia);
  }

  async create(data: ICreateProjectMediaDTO): Promise<ProjectMediaListItem> {
    const item = this.ormRepo.create({
      project_id: data.project_id,
      name: data.name,
      media: data.media,
    });
    const saved = await this.ormRepo.save(item);

    return (await this.findByIdWithRelations(saved.id))!;
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): ProjectMediaListItem {
    return {
      id: Number(raw.pm_id),
      name: raw.pm_name,
      media: raw.pm_media,

      project: {
        id: Number(raw.p_id),
        name: raw.p_name,
        description: raw.p_description,
        status: Boolean(raw.p_status),
        begin_date: raw.p_begin_date,
        end_date: raw.p_end_date ?? null,

        projectType: {
          id: Number(raw.pt_id),
          name: raw.pt_name,
        },
      },
    };
  }

  async findAll({
    search,
    page,
    skip,
    take,
    project_id,
  }: PaginateParams): Promise<ProjectMediaPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("pm")
      .innerJoin("pm.project", "p")
      .innerJoin("p.projectType", "pt")
      .select([
        // ProjectMedia
        "pm.id as pm_id",
        "pm.name as pm_name",
        "pm.media as pm_media",

        // Project
        "p.id as p_id",
        "p.name as p_name",
        "p.description as p_description",
        "p.status as p_status",
        "p.begin_date as p_begin_date",
        "p.end_date as p_end_date",

        // ProjectType
        "pt.id as pt_id",
        "pt.name as pt_name",
      ])
      .orderBy("pm.name", "ASC");

    if (project_id) {
      qb.andWhere("pm.project_id = :pid", { pid: project_id });
    }

    // busca por name/media/project/projectType
    const trimmed = search?.trim();
    if (trimmed) {
      qb.andWhere(
        "(pm.name LIKE :s OR pm.media LIKE :s OR p.name LIKE :s OR p.description LIKE :s OR pt.name LIKE :s)",
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

  async findByIdWithRelations(id: number): Promise<ProjectMediaListItem | null> {
    const raw = await this.ormRepo
      .createQueryBuilder("pm")
      .innerJoin("pm.project", "p")
      .innerJoin("p.projectType", "pt")
      .select([
        "pm.id as pm_id",
        "pm.name as pm_name",
        "pm.media as pm_media",

        "p.id as p_id",
        "p.name as p_name",
        "p.description as p_description",
        "p.status as p_status",
        "p.begin_date as p_begin_date",
        "p.end_date as p_end_date",

        "pt.id as pt_id",
        "pt.name as pt_name",
      ])
      .where("pm.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateProjectMediaDTO): Promise<ProjectMediaListItem> {
    await this.ormRepo.update(
      { id: data.id },
      {
        project_id: data.project_id,
        name: data.name,
        media: data.media,
      }
    );

    return (await this.findByIdWithRelations(data.id))!;
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { Project } from "../entities/Project";
import {
  IProjectRepository,
  ICreateProjectDTO,
  IUpdateProjectDTO,
  PaginateParams,
  ProjectsPaginateProperties,
  ProjectListItem,
} from "./IProjectRepository";

export class ProjectRepository implements IProjectRepository {
  private ormRepo: Repository<Project>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(Project);
  }

  async create(data: ICreateProjectDTO): Promise<{ id: number }> {
    const project = this.ormRepo.create(data);
    const saved = await this.ormRepo.save(project);

    return { id: saved.id };
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { id } });
    return count > 0;
  }

  private mapRawToItem(raw: any): ProjectListItem {
    return {
      id: Number(raw.p_id),
      name: raw.p_name,
      description: raw.p_description,
      status: Boolean(raw.p_status),
      begin_date: raw.p_begin_date,
      end_date: raw.p_end_date ?? null,
      projectType: {
        id: Number(raw.t_id),
        name: raw.t_name,
      },
    };
  }

  async findAll({
    page,
    skip,
    take,
    project_name,
    status,
  }: PaginateParams): Promise<ProjectsPaginateProperties> {
    const qb = this.ormRepo
      .createQueryBuilder("p")
      .innerJoin("p.projectType", "t")
      .select([
        "p.id as p_id",
        "p.name as p_name",
        "p.description as p_description",
        "p.status as p_status",
        "p.begin_date as p_begin_date",
        "p.end_date as p_end_date",
        "t.id as t_id",
        "t.name as t_name",
      ])
      .orderBy("p.name", "ASC");

    const pname = project_name?.trim();
    if (pname) {
      qb.andWhere("p.name LIKE :pname", { pname: `%${pname}%` });
    }

    if (typeof status === "boolean") {
      qb.andWhere("p.status = :st", { st: status });
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

  async findByIdWithRelations(id: number): Promise<ProjectListItem | null> {
    const raw = await this.ormRepo
      .createQueryBuilder("p")
      .innerJoin("p.projectType", "t")
      .select([
        "p.id as p_id",
        "p.name as p_name",
        "p.description as p_description",
        "p.status as p_status",
        "p.begin_date as p_begin_date",
        "p.end_date as p_end_date",
        "t.id as t_id",
        "t.name as t_name",
      ])
      .where("p.id = :id", { id })
      .getRawOne();

    return raw ? this.mapRawToItem(raw) : null;
  }

  async update(data: IUpdateProjectDTO): Promise<void> {
    await this.ormRepo.update({ id: data.id }, data);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete({ id });
  }
}
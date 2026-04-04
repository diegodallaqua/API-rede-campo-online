import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ProjectHasResearchArea } from "../entities/ProjectHasResearchArea";
import {
  ICreateProjectHasResearchAreaDTO,
  IProjectHasResearchAreasRepository,
  ProjectResearchAreaItem,
} from "./IProjectHasResearchAreaRepository";

export class ProjectHasResearchAreasRepository
  implements IProjectHasResearchAreasRepository
{
  private ormRepo: Repository<ProjectHasResearchArea>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ProjectHasResearchArea);
  }

  async createMany(data: ICreateProjectHasResearchAreaDTO[]): Promise<void> {
    if (!data.length) return;

    const entities = this.ormRepo.create(data);
    await this.ormRepo.save(entities);
  }

  async deleteByProjectId(project_id: number): Promise<void> {
    await this.ormRepo.delete({ project_id });
  }

  async findResearchAreaIdsByProjectId(project_id: number): Promise<number[]> {
    const rows = await this.ormRepo.find({
      where: { project_id },
      select: {
        research_area_id: true,
      },
      order: {
        research_area_id: "ASC",
      },
    });

    return rows.map((row) => row.research_area_id);
  }

  async findResearchAreasByProjectId(
    project_id: number
  ): Promise<ProjectResearchAreaItem[]> {
    const rows = await this.ormRepo
      .createQueryBuilder("phra")
      .innerJoin("phra.researchArea", "ra")
      .select([
        "ra.id as id",
        "ra.name as name",
      ])
      .where("phra.project_id = :project_id", { project_id })
      .orderBy("ra.name", "ASC")
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
    }));
  }
}
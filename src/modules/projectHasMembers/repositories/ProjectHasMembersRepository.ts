import { Repository } from "typeorm";
import { AppDataSource } from "../../../shared/infra/database/data-source";
import { ProjectHasMember } from "../entities/ProjectHasMember";
import {
  ICreateProjectHasMemberDTO,
  IProjectHasMembersRepository,
  ProjectMemberItem,
} from "./IProjectHasMembersRepository";

export class ProjectHasMembersRepository
  implements IProjectHasMembersRepository
{
  private ormRepo: Repository<ProjectHasMember>;

  constructor() {
    this.ormRepo = AppDataSource.getRepository(ProjectHasMember);
  }

  async createMany(data: ICreateProjectHasMemberDTO[]): Promise<void> {
    if (!data.length) return;

    const entities = this.ormRepo.create(data);
    await this.ormRepo.save(entities);
  }

  async deleteByProjectId(project_id: number): Promise<void> {
    await this.ormRepo.delete({ project_id });
  }

  async findMemberIdsByProjectId(project_id: number): Promise<number[]> {
    const rows = await this.ormRepo.find({
      where: { project_id },
      select: {
        member_id: true,
      },
      order: {
        member_id: "ASC",
      },
    });

    return rows.map((row) => row.member_id);
  }

  async findMembersByProjectId(project_id: number): Promise<ProjectMemberItem[]> {
    const rows = await this.ormRepo
      .createQueryBuilder("phm")
      .innerJoin("phm.member", "m")
      .select([
        "m.id as id",
        "m.name as name",
        "m.email as email",
      ])
      .where("phm.project_id = :project_id", { project_id })
      .orderBy("m.name", "ASC")
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      email: row.email,
    }));
  }
}
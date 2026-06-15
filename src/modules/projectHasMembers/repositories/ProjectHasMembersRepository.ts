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
      .innerJoin("m.memberRole", "mr")
      .innerJoin("m.organization", "o")
      .select([
        "m.id as m_id",
        "m.name as m_name",
        "m.email as m_email",
        "m.description as m_description",
        "m.lattes_url as m_lattes_url",
        "m.linked_in_url as m_linked_in_url",
        "m.profile_picture as m_profile_picture",
        "mr.id as mr_id",
        "mr.name as mr_name",
        "o.id as o_id",
        "o.name as o_name",
        "o.logo as o_logo",
        "o.address_id as o_address_id",
      ])
      .where("phm.project_id = :project_id", { project_id })
      .orderBy("m.name", "ASC")
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.m_id),
      name: row.m_name,
      email: row.m_email,
      description: row.m_description,
      lattes_url: row.m_lattes_url ?? null,
      linked_in_url: row.m_linked_in_url ?? null,
      profile_picture: row.m_profile_picture ?? null,
      member_role: {
        id: Number(row.mr_id),
        name: row.mr_name,
      },
      organization: {
        id: Number(row.o_id),
        name: row.o_name,
        logo: row.o_logo,
        address_id: Number(row.o_address_id),
      },
    }));
  }
}
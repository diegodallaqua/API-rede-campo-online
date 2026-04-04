export interface ICreateProjectHasMemberDTO {
  project_id: number;
  member_id: number;
}

export type ProjectMemberItem = {
  id: number;
  name: string;
  email: string;
};

export interface IProjectHasMembersRepository {
  createMany(data: ICreateProjectHasMemberDTO[]): Promise<void>;
  deleteByProjectId(project_id: number): Promise<void>;
  findMemberIdsByProjectId(project_id: number): Promise<number[]>;
  findMembersByProjectId(project_id: number): Promise<ProjectMemberItem[]>;
}
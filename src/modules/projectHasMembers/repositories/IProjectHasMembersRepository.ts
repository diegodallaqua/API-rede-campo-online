export interface ICreateProjectHasMemberDTO {
  project_id: number;
  member_id: number;
}

export type ProjectMemberItem = {
  id: number;
  name: string;
  email: string;
  description: string;
  lattes_url: string | null;
  linked_in_url: string | null;
  instagram_url: string | null;
  profile_picture: string | null;
  member_role: {
    id: number;
    name: string;
  };
  organization: {
    id: number;
    name: string;
    logo: string;
    address_id: number;
  };
};

export interface IProjectHasMembersRepository {
  createMany(data: ICreateProjectHasMemberDTO[]): Promise<void>;
  deleteByProjectId(project_id: number): Promise<void>;
  findMemberIdsByProjectId(project_id: number): Promise<number[]>;
  findMembersByProjectId(project_id: number): Promise<ProjectMemberItem[]>;
}
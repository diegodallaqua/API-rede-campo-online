import { ProjectMemberItem } from "../../projectHasMembers/repositories/IProjectHasMembersRepository";

export type ProjectListItem = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  begin_date: string;
  end_date: string | null;

  projectType: {
    id: number;
    name: string;
  };

  research_areas?: {
    id: number;
    name: string;
  }[];

  members?: ProjectMemberItem[];
};

export type ProjectsPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ProjectListItem[];
};

export interface ICreateProjectDTO {
  project_type_id: number;
  name: string;
  description: string;
  status: boolean;
  begin_date: string;
  end_date?: string | null;
}

export interface IUpdateProjectDTO extends ICreateProjectDTO {
  id: number;
}

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  project_name?: string;
  status?: boolean;
};

export interface IProjectRepository {
  create(data: ICreateProjectDTO): Promise<{ id: number }>;

  findAll(params: PaginateParams): Promise<ProjectsPaginateProperties>;

  findByIdWithRelations(id: number): Promise<ProjectListItem | null>;

  existsById(id: number): Promise<boolean>;

  update(data: IUpdateProjectDTO): Promise<void>;

  delete(id: number): Promise<void>;
}
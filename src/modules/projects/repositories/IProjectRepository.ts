export type PaginateParams = {
  page: number;
  skip: number;
  take: number;

  project_name?: string;
  project_type_id?: number;
  status?: boolean;
};

export type ProjectListItem = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  begin_date: string;
  end_date: string | null;
  external_staff: string | null;

  projectType: {
    id: number;
    name: string;
  };
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
  external_staff?: string | null;
}

export interface IUpdateProjectDTO extends ICreateProjectDTO {
  id: number;
}

export interface IProjectRepository {
  create(data: ICreateProjectDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<ProjectsPaginateProperties>;

  findByIdWithRelations(id: number): Promise<ProjectListItem | null>;

  existsById(id: number): Promise<boolean>;

  update(data: IUpdateProjectDTO): Promise<void>;

  delete(id: number): Promise<void>;
}
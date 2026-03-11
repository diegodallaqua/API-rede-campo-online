export interface ICreateProjectMediaDTO {
  project_id: number;
  name: string;
  media: string; 
}

export interface IUpdateProjectMediaDTO extends ICreateProjectMediaDTO {
  id: number;
}

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  project_id?: number;
};

export type ProjectMediaListItem = {
  id: number;
  name: string;
  media: string;

  project: {
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
  };
};

export type ProjectMediaPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ProjectMediaListItem[];
};

export interface IProjectMediaRepository {
  create(data: ICreateProjectMediaDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<ProjectMediaPaginateProperties>;

  findByIdWithRelations(id: number): Promise<ProjectMediaListItem | null>;

  update(data: IUpdateProjectMediaDTO): Promise<void>;

  delete(id: number): Promise<void>;

  existsById(id: number): Promise<boolean>;
}
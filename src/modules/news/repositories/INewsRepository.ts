export type NewsListItem = {
  id: number;
  title: string;
  description: string;
  content: string;
  publication_date: string;

  project: {
    id: number;
    name: string;
  } | null;

  member: {
    id: number;
    name: string;
    email: string;
  };
};

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  project_id?: number;
};

export type NewsPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: NewsListItem[];
};

export interface ICreateNewsDTO {
  project_id?: number | null;
  member_id: number;
  title: string;
  description: string;
  content: string;
  publication_date: string;
}

export interface IUpdateNewsDTO extends ICreateNewsDTO {
  id: number;
}

export interface INewsRepository {
  create(data: ICreateNewsDTO): Promise<void>;
  findAll(params: PaginateParams): Promise<NewsPaginateProperties>;
  findByIdWithRelations(id: number): Promise<NewsListItem | null>;
  existsById(id: number): Promise<boolean>;
  update(data: IUpdateNewsDTO): Promise<void>;
  delete(id: number): Promise<void>;
}
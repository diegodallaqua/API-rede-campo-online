export type NewsMediaListItem = {
  id: number;
  name: string;
  media: string;

  news: {
    id: number;
    title: string;
    description: string;
    content: string;
    publication_date: string;
  };
};

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  news_id?: number;
};

export type NewsMediaPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: NewsMediaListItem[];
};

export interface ICreateNewsMediaDTO {
  news_id: number;
  name: string;
  media: string;
}

export interface IUpdateNewsMediaDTO extends ICreateNewsMediaDTO {
  id: number;
}

export interface INewsMediaRepository {
  create(data: ICreateNewsMediaDTO): Promise<void>;
  findAll(params: PaginateParams): Promise<NewsMediaPaginateProperties>;
  findByIdWithRelations(id: number): Promise<NewsMediaListItem | null>;
  existsById(id: number): Promise<boolean>;
  update(data: IUpdateNewsMediaDTO): Promise<void>;
  delete(id: number): Promise<void>;
}
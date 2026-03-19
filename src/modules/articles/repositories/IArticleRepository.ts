export type ArticleListItem = {
  publication_id: number;
  journal_name: string;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  publisher: string | null;

  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
  };
};

export interface ICreateArticleDTO {
  publication_id: number;
  journal_name: string;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  publisher?: string | null;
}

export interface IUpdateArticleDTO extends ICreateArticleDTO {}

export type PaginateParams = {
  title?: string;
  page: number;
  skip: number;
  take: number;
};

export type ArticlePaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ArticleListItem[];
};

export interface IArticleRepository {
  create(data: ICreateArticleDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<ArticlePaginateProperties>;

  findByIdWithRelations(publication_id: number): Promise<ArticleListItem | null>;

  existsByPublicationId(publication_id: number): Promise<boolean>;

  update(data: IUpdateArticleDTO): Promise<void>;

  delete(publication_id: number): Promise<void>;
}
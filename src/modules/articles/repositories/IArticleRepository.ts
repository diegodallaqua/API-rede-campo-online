export type ArticleListItem = {
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

export type ArticleResearchAreaItem = {
  id: number;
  name: string;
};

export type ArticleContributorItem = {
  author_order: number;
  contributor_role: { id: number; name: string };
  member: { id: number; name: string; email: string } | null;
  external_author: { id: number; name: string; email: string | null; orcid: string | null } | null;
};

export type ArticleListItemEnriched = {
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
    research_areas: ArticleResearchAreaItem[];
    contributors: ArticleContributorItem[];
  };
};

export type ArticleEnrichedPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ArticleListItemEnriched[];
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
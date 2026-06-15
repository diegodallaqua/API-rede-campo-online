export type BookChapterListItem = {
  book_name: string;
  chapter_number: number;

  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
  };
};

export type BookChapterResearchAreaItem = {
  id: number;
  name: string;
};

export type BookChapterContributorItem = {
  author_order: number;
  contributor_role: { id: number; name: string };
  member: { id: number; name: string; email: string } | null;
  external_author: { id: number; name: string; email: string | null; orcid: string | null } | null;
};

export type BookChapterListItemEnriched = {
  book_name: string;
  chapter_number: number;
  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
    research_areas: BookChapterResearchAreaItem[];
    contributors: BookChapterContributorItem[];
  };
};

export type BookChapterEnrichedPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: BookChapterListItemEnriched[];
};

export interface ICreateBookChapterDTO {
  publication_id: number;
  book_name: string;
  chapter_number: number;
}

export interface IUpdateBookChapterDTO extends ICreateBookChapterDTO {}

export type PaginateParams = {
  title?: string;
  page: number;
  skip: number;
  take: number;
};

export type BookChapterPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: BookChapterListItem[];
};

export interface IBookChapterRepository {
  create(data: ICreateBookChapterDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<BookChapterPaginateProperties>;

  findByIdWithRelations(publication_id: number): Promise<BookChapterListItem | null>;

  existsByPublicationId(publication_id: number): Promise<boolean>;

  update(data: IUpdateBookChapterDTO): Promise<void>;

  delete(publication_id: number): Promise<void>;
}
export type BookListItem = {
  publisher: string;
  edition: string;
  cover_photo: string | null;
  isbn: string;
  book_url: string | null;

  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
  };
};

export type BookResearchAreaItem = {
  id: number;
  name: string;
};

export type BookContributorItem = {
  author_order: number;
  contributor_role: { id: number; name: string };
  member: { id: number; name: string; email: string } | null;
  external_author: { id: number; name: string; email: string | null; orcid: string | null } | null;
};

export type BookListItemEnriched = {
  publisher: string;
  edition: string;
  cover_photo: string | null;
  isbn: string;
  book_url: string | null;
  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
    research_areas: BookResearchAreaItem[];
    contributors: BookContributorItem[];
  };
};

export type BookEnrichedPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: BookListItemEnriched[];
};

export interface ICreateBookDTO {
  publication_id: number;
  publisher: string;
  edition: string;
  cover_photo?: string | null;
  isbn: string;
  book_url?: string | null;
}

export interface IUpdateBookDTO extends ICreateBookDTO {}

export type PaginateParams = {
  title?: string;
  page: number;
  skip: number;
  take: number;
};

export type BookPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: BookListItem[];
};

export interface IBookRepository {
  create(data: ICreateBookDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<BookPaginateProperties>;

  findByIdWithRelations(publication_id: number): Promise<BookListItem | null>;

  existsByPublicationId(publication_id: number): Promise<boolean>;

  update(data: IUpdateBookDTO): Promise<void>;

  delete(publication_id: number): Promise<void>;
}
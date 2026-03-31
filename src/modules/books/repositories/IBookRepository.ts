export type BookListItem = {
  publication_id: number;
  publisher: string;
  edition: string;
  cover_photo: string | null;

  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
  };
};

export interface ICreateBookDTO {
  publication_id: number;
  publisher: string;
  edition: string;
  cover_photo?: string | null;
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
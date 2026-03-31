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
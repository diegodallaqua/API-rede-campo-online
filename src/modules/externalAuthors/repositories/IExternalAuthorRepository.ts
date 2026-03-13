import { ExternalAuthor } from "../entities/ExternalAuthor";

export interface ICreateExternalAuthorDTO {
  name: string;
  email?: string | null;
  orcid?: string | null;
}

export interface IUpdateExternalAuthorDTO extends ICreateExternalAuthorDTO {
  id: number;
}

export type PaginateParams = {
  name?: string;
  page: number;
  skip: number;
  take: number;
};

export type ExternalAuthorPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ExternalAuthor[];
};

export interface IExternalAuthorRepository {
  create(data: ICreateExternalAuthorDTO): Promise<ExternalAuthor>;
  findAll(params: PaginateParams): Promise<ExternalAuthorPaginateProperties>;
  findById(id: number): Promise<ExternalAuthor | null>;
  update(data: IUpdateExternalAuthorDTO): Promise<ExternalAuthor>;
  delete(id: number): Promise<void>;
}
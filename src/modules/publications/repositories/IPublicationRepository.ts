import { Publication } from "../entities/Publication";

export interface ICreatePublicationDTO {
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
}

export interface IUpdatePublicationDTO extends ICreatePublicationDTO {
  id: number;
}

export type PublicationWithResearchAreas = {
  id: number;
  title: string;
  abstract: string;
  publication_date: string;
  doi: string | null;
  research_areas: {
    id: number;
    name: string;
  }[];
};

export type PaginateParams = {
  title?: string;
  page: number;
  skip: number;
  take: number;
};

export type PublicationPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: Publication[];
};

export type PublicationWithResearchAreasPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: PublicationWithResearchAreas[];
};

export interface IPublicationRepository {
  create(data: ICreatePublicationDTO): Promise<Publication>;
  findAll(params: PaginateParams): Promise<PublicationPaginateProperties>;
  findById(id: number): Promise<Publication | null>;
  findByDoi(doi: string): Promise<Publication | null>;
  update(data: IUpdatePublicationDTO): Promise<Publication>;
  delete(id: number): Promise<void>;
}
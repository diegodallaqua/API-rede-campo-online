import { Publication } from "../entities/Publication";
import { PublicationContributorEmbedItem } from "../../publicationContributors/repositories/IPublicationContributorRepository";

export interface ICreatePublicationDTO {
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
}

export interface IUpdatePublicationDTO extends ICreatePublicationDTO {
  id: number;
}

export type PublicationArticleDetails = {
  type: "article";
  journal_name: string;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  publisher: string | null;
};

export type PublicationBookDetails = {
  type: "book";
  publisher: string;
  edition: string;
  cover_photo: string | null;
  isbn: string;
  book_url: string | null;
};

export type PublicationBookChapterDetails = {
  type: "book_chapter";
  book_name: string;
  chapter_number: number;
};

export type PublicationThesisDetails = {
  type: "thesis";
  number_of_pages: number;
  organization: {
    id: number;
    name: string;
    logo: string;
  };
};

export type PublicationTypeDetails =
  | PublicationArticleDetails
  | PublicationBookDetails
  | PublicationBookChapterDetails
  | PublicationThesisDetails;

export type PublicationWithResearchAreas = {
  id: number;
  title: string;
  abstract: string;
  publication_date: string;
  doi: string | null;
  details: PublicationTypeDetails | null;
  research_areas: {
    id: number;
    name: string;
  }[];
  contributors: PublicationContributorEmbedItem[];
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
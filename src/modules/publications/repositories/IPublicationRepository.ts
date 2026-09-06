import { Publication } from "../entities/Publication";
import { PublicationContributorEmbedItem } from "../../publicationContributors/repositories/IPublicationContributorRepository";

export interface ICreatePublicationDTO {
  title: string;
  abstract: string;
  publication_date: string;
  doi?: string | null;
  project_id?: number | null;
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
  isbn: string | null;
  start_page: string;
  end_page: string;
  book: {
    id: number;
    publisher: string;
    edition: string;
    isbn: string;
  } | null;
};

export type PublicationAcademicWorkDetails = {
  type: "academic_work";
  number_of_pages: number;
  defense_date: string;
  organization: {
    id: number;
    name: string;
    logo: string;
  };
  academic_work_type: {
    id: number;
    name: string;
    degree_level: string;
  };
};

export type PublicationTypeDetails =
  | PublicationArticleDetails
  | PublicationBookDetails
  | PublicationBookChapterDetails
  | PublicationAcademicWorkDetails;

export type PublicationProject = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  begin_date: string;
  end_date: string | null;
  projectType: {
    id: number;
    name: string;
  };
};

export type PublicationWithProject = {
  id: number;
  title: string;
  abstract: string;
  publication_date: string;
  doi: string | null;
  project: PublicationProject | null;
};

export type PublicationWithResearchAreas = PublicationWithProject & {
  details: PublicationTypeDetails | null;
  research_areas: {
    id: number;
    name: string;
  }[];
  contributors: PublicationContributorEmbedItem[];
};

export type PaginateParams = {
  title?: string;
  project_id?: number;
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
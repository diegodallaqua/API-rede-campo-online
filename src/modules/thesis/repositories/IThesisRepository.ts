export type ThesisListItem = {
  number_of_pages: number;

  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
  };

  organization: {
    id: number;
    name: string;
    logo: string;
  };
};

export type ThesisResearchAreaItem = {
  id: number;
  name: string;
};

export type ThesisContributorItem = {
  author_order: number;
  contributor_role: { id: number; name: string };
  member: { id: number; name: string; email: string } | null;
  external_author: { id: number; name: string; email: string | null; orcid: string | null } | null;
};

export type ThesisListItemEnriched = {
  number_of_pages: number;
  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
    research_areas: ThesisResearchAreaItem[];
    contributors: ThesisContributorItem[];
  };
  organization: {
    id: number;
    name: string;
    logo: string;
  };
};

export type ThesisEnrichedPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ThesisListItemEnriched[];
};

export interface ICreateThesisDTO {
  publication_id: number;
  organization_id: number;
  number_of_pages: number;
}

export interface IUpdateThesisDTO extends ICreateThesisDTO {}

export type PaginateParams = {
  title?: string;
  organization_id?: number;
  page: number;
  skip: number;
  take: number;
};

export type ThesisPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ThesisListItem[];
};

export interface IThesisRepository {
  create(data: ICreateThesisDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<ThesisPaginateProperties>;

  findByIdWithRelations(publication_id: number): Promise<ThesisListItem | null>;

  existsByPublicationId(publication_id: number): Promise<boolean>;

  update(data: IUpdateThesisDTO): Promise<void>;

  delete(publication_id: number): Promise<void>;
}

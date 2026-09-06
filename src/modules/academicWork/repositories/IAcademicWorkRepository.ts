export type AcademicWorkTypeItem = {
  id: number;
  name: string;
  degree_level: string;
};

export type AcademicWorkListItem = {
  number_of_pages: number;
  defense_date: string;

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

  academic_work_type: AcademicWorkTypeItem;
};

export type AcademicWorkResearchAreaItem = {
  id: number;
  name: string;
};

export type AcademicWorkContributorItem = {
  author_order: number;
  contributor_role: { id: number; name: string };
  member: { id: number; name: string; email: string } | null;
  external_author: { id: number; name: string; email: string | null; orcid: string | null } | null;
};

export type AcademicWorkListItemEnriched = {
  number_of_pages: number;
  defense_date: string;
  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: string;
    doi: string | null;
    research_areas: AcademicWorkResearchAreaItem[];
    contributors: AcademicWorkContributorItem[];
  };
  organization: {
    id: number;
    name: string;
    logo: string;
  };
  academic_work_type: AcademicWorkTypeItem;
};

export type AcademicWorkEnrichedPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: AcademicWorkListItemEnriched[];
};

export interface ICreateAcademicWorkDTO {
  publication_id: number;
  organization_id: number;
  academic_work_type_id: number;
  defense_date: string;
  number_of_pages: number;
}

export interface IUpdateAcademicWorkDTO extends ICreateAcademicWorkDTO {}

export type PaginateParams = {
  title?: string;
  organization_id?: number;
  academic_work_type_id?: number;
  page: number;
  skip: number;
  take: number;
};

export type AcademicWorkPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: AcademicWorkListItem[];
};

export interface IAcademicWorkRepository {
  create(data: ICreateAcademicWorkDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<AcademicWorkPaginateProperties>;

  findByIdWithRelations(publication_id: number): Promise<AcademicWorkListItem | null>;

  existsByPublicationId(publication_id: number): Promise<boolean>;

  update(data: IUpdateAcademicWorkDTO): Promise<void>;

  delete(publication_id: number): Promise<void>;
}

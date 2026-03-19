export type TechnicalReportListItem = {
  publication_id: number;
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

export interface ICreateTechnicalReportDTO {
  publication_id: number;
  organization_id: number;
  number_of_pages: number;
}

export interface IUpdateTechnicalReportDTO extends ICreateTechnicalReportDTO {}

export type PaginateParams = {
  title?: string;
  organization_id?: number;
  page: number;
  skip: number;
  take: number;
};

export type TechnicalReportPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: TechnicalReportListItem[];
};

export interface ITechnicalReportRepository {
  create(data: ICreateTechnicalReportDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<TechnicalReportPaginateProperties>;

  findByIdWithRelations(publication_id: number): Promise<TechnicalReportListItem | null>;

  existsByPublicationId(publication_id: number): Promise<boolean>;

  update(data: IUpdateTechnicalReportDTO): Promise<void>;

  delete(publication_id: number): Promise<void>;
}
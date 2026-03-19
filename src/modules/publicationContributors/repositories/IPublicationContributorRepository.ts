export type PublicationContributorListItem = {
  publication_id: number;
  author_order: number;

  publication: {
    id: number;
    title: string;
    publication_date: string;
    doi: string | null;
  };

  contributorRole: {
    id: number;
    name: string;
  };

  member: {
    id: number;
    name: string;
    email: string;
  } | null;

  externalAuthor: {
    id: number;
    name: string;
    email: string | null;
    orcid: string | null;
  } | null;
};

export interface ICreatePublicationContributorDTO {
  publication_id: number;
  member_id?: number | null;
  external_author_id?: number | null;
  contributor_role_id: number;
  author_order: number;
}

export interface IUpdatePublicationContributorDTO {
  publication_id: number;
  current_author_order: number;
  member_id?: number | null;
  external_author_id?: number | null;
  contributor_role_id: number;
  author_order: number;
}

export type PaginateParams = {
  publication_id?: number;
  page: number;
  skip: number;
  take: number;
};

export type PublicationContributorPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: PublicationContributorListItem[];
};

export interface IPublicationContributorRepository {
  create(data: ICreatePublicationContributorDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<PublicationContributorPaginateProperties>;

  findByIdWithRelations(
    publication_id: number,
    author_order: number
  ): Promise<PublicationContributorListItem | null>;

  existsById(publication_id: number, author_order: number): Promise<boolean>;

  findByPublicationAndAuthorOrder(
    publication_id: number,
    author_order: number
  ): Promise<{
    publication_id: number;
    author_order: number;
    member_id: number | null;
    external_author_id: number | null;
    contributor_role_id: number;
  } | null>;

  findMemberConflict(
    publication_id: number,
    member_id: number,
    contributor_role_id: number
  ): Promise<boolean>;

  findExternalAuthorConflict(
    publication_id: number,
    external_author_id: number,
    contributor_role_id: number
  ): Promise<boolean>;

  update(data: IUpdatePublicationContributorDTO): Promise<void>;

  delete(publication_id: number, author_order: number): Promise<void>;
}
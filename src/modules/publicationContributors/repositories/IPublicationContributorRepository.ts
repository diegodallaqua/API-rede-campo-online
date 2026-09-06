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
    profile_picture?: string | null;
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

export type PublicationContributorEmbedItem = {
  author_order: number;
  contributor_role: { id: number; name: string };
  member: {
    id: number;
    name: string;
    email: string;
    description: string;
    lattes_url: string | null;
    linked_in_url: string | null;
    instagram_url: string | null;
    profile_picture: string | null;
    member_role: { id: number; name: string };
    organization: { id: number; name: string; logo: string; address_id: number };
  } | null;
  external_author: { id: number; name: string; email: string | null; orcid: string | null } | null;
};

export interface IPublicationContributorRepository {
  create(data: ICreatePublicationContributorDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<PublicationContributorPaginateProperties>;

  findByPublicationId(publication_id: number): Promise<PublicationContributorEmbedItem[]>;

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
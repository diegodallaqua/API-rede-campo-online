import { ContributorRole } from "../entities/ContributorRole";

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
};

export type ContributorRolePaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ContributorRole[];
};

export interface IContributorRoleRepository {
  findById(id: number): Promise<ContributorRole | null>;
  findAll(params: PaginateParams): Promise<ContributorRolePaginateProperties>;
}

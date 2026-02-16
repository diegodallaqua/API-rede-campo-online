import { MemberRole } from "../entities/MemberRole";

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
};

export type MemberRolesPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: MemberRole[];
};

export interface IMemberRoleRepository {
  findById(id: number): Promise<MemberRole | null>;
  findAll(params: PaginateParams): Promise<MemberRolesPaginateProperties>;
}

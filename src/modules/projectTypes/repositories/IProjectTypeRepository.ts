import { ProjectType } from "../entities/ProjectType";

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
};

export type ProjectTypesPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ProjectType[];
};

export interface IProjectTypeRepository {
  findById(id: number): Promise<ProjectType | null>;
  findAll(params: PaginateParams): Promise<ProjectTypesPaginateProperties>;
}

import { ResearchArea } from "../entities/ResearchArea";

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
};

export type ResearchAreaPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: ResearchArea[];
};

export interface IResearchAreaRepository {
  findById(id: number): Promise<ResearchArea | null>;
  findAll(params: PaginateParams): Promise<ResearchAreaPaginateProperties>;
}

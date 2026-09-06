import { AcademicWorkType } from "../entities/AcademicWorkType";

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
};

export type AcademicWorkTypesPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: AcademicWorkType[];
};

export interface IAcademicWorkTypeRepository {
  findById(id: number): Promise<AcademicWorkType | null>;
  findAll(params: PaginateParams): Promise<AcademicWorkTypesPaginateProperties>;
}

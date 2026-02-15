import { State } from "../entities/State";

export type ICreateStateDTO = {
  name: string;
};

export interface IUpdateStateDTO {
  id: number;
  name: string;
}

export type PaginateParams = {
  search: string;
  page: number;
  skip: number;
  take: number;
};

export type StatesPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: State[];
};

export interface IStatesRepository {
  create(data: ICreateStateDTO): Promise<State>;
  findAll({
    search,
    page,
    skip,
    take,
  }: PaginateParams): Promise<StatesPaginateProperties>;
  findById(id: number): Promise<State | null>;
  findByName(name: string): Promise<State | null>;
  update(data: IUpdateStateDTO): Promise<State>;
  delete(id: number): Promise<void>;
}

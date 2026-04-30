import { City } from "../entities/City";

export type CityListItem = {
  id: number;
  name: string;

  state: {
    id: number;
    name: string;
  };
};

export interface ICreateCityDTO {
  state_id: number;
  name: string;
}

export interface IUpdateCityDTO {
  id: number;
  state_id: number;
  name: string;
}

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  state_id?: number;
};

export type CitiesPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: CityListItem[];
};

export interface ICityRepository {
  create(data: ICreateCityDTO): Promise<City>;

  findAll(params: PaginateParams): Promise<CitiesPaginateProperties>;

  findById(id: number): Promise<City | null>;
  findByIdWithRelations(id: number): Promise<CityListItem | null>;
  findByNameInState(state_id: number, name: string): Promise<City | null>;

  countByStateId(state_id: number): Promise<number>;

  update(data: IUpdateCityDTO): Promise<City>;
  delete(id: number): Promise<void>;
}
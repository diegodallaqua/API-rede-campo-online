import { Address } from "../entities/Address";

export type AddressListItem = {
  id: number;
  street: string;
  neighborhood: string;
  number: number;
  cep: string;
  complement: string | null;

  city: {
    id: number;
    name: string;
    state: {
      id: number;
      name: string;
    };
  };
};

export interface ICreateAddressDTO {
  city_id: number;
  street: string;
  neighborhood: string;
  number: number;
  cep: string;
  complement?: string;
}

export interface IUpdateAddressDTO extends ICreateAddressDTO {
  id: number;
}

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  city_id?: number;
};

export type AddressesPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: AddressListItem[];
};

export interface IAddressRepository {
  create(data: ICreateAddressDTO): Promise<Address>;
  findAll(params: PaginateParams): Promise<AddressesPaginateProperties>;
  findById(id: number): Promise<Address | null>;
  findByIdWithRelations(id: number): Promise<AddressListItem | null>;
  update(data: IUpdateAddressDTO): Promise<Address>;
  delete(id: number): Promise<void>;
}
import { Organization } from "../entities/Organization";

export type OrganizationListItem = {
  id: number;
  name: string;
  logo: string;

  address: {
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
};

export interface ICreateOrganizationDTO {
  address_id: number;
  name: string;
  logo: string;
}

export interface IUpdateOrganizationDTO extends ICreateOrganizationDTO {
  id: number;
}

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  address_id?: number;
};

export type OrganizationsPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: OrganizationListItem[];
};

export interface IOrganizationRepository {
  create(data: ICreateOrganizationDTO): Promise<Organization>;

  findAll(params: PaginateParams): Promise<OrganizationsPaginateProperties>;

  findById(id: number): Promise<Organization | null>;
  findByIdWithRelations(id: number): Promise<OrganizationListItem | null>;
  findByName(name: string): Promise<Organization | null>;

  update(data: IUpdateOrganizationDTO): Promise<Organization>;
  delete(id: number): Promise<void>;
}
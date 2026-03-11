export type EventListItem = {
  id: number;
  name: string;
  date: string;
  description: string | null;
  registration_url: string | null;

  project: {
    id: number;
    name: string;
    description: string;
    status: boolean;
    begin_date: string;
    end_date: string | null;
    projectType: {
      id: number;
      name: string;
    };
  };

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

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  project_id?: number;
};

export type EventsPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: EventListItem[];
};

export interface ICreateEventDTO {
  address_id: number;
  project_id: number;
  name: string;
  date: string;
  description?: string | null;
  registration_url?: string | null;
}

export interface IUpdateEventDTO extends ICreateEventDTO {
  id: number;
}

export interface IEventRepository {
  create(data: {
    address_id: number;
    project_id: number;
    name: string;
    date: Date;
    description?: string | null;
    registration_url?: string | null;
  }): Promise<void>;

  findAll(params: PaginateParams): Promise<EventsPaginateProperties>;

  findByIdWithRelations(id: number): Promise<EventListItem | null>;

  existsById(id: number): Promise<boolean>;

  update(data: {
    id: number;
    address_id: number;
    project_id: number;
    name: string;
    date: Date;
    description?: string | null;
    registration_url?: string | null;
  }): Promise<void>;

  delete(id: number): Promise<void>;
}
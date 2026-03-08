export interface ICreateEventMediaDTO {
  event_id: number;
  name: string;
  media: string;
}

export interface IUpdateEventMediaDTO extends ICreateEventMediaDTO {
  id: number;
}

export type EventMediaListItem = {
  id: number;
  name: string;
  media: string;

  event: {
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
      external_staff: string | null;
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
};

export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  event_id?: number;
};

export type EventMediaPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: EventMediaListItem[];
};

export interface IEventMediaRepository {
  create(data: ICreateEventMediaDTO): Promise<void>;

  findAll(params: PaginateParams): Promise<EventMediaPaginateProperties>;

  findByIdWithEvent(id: number): Promise<EventMediaListItem | null>;

  existsById(id: number): Promise<boolean>;

  update(data: IUpdateEventMediaDTO): Promise<void>;

  delete(id: number): Promise<void>;
}
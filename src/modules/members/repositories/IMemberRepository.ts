export type PaginateParams = {
  search?: string;
  page: number;
  skip: number;
  take: number;
  member_role_id?: number;
  organization_id?: number;
};

export type MemberListItem = {
  id: number;
  name: string;
  email: string;
  description: string;
  lattes_url: string | null;
  linked_in_url: string | null;
  profile_picture: string | null;

  member_role: {
    id: number;
    name: string;
  };

  organization: {
    id: number;
    name: string;
    logo: string;
    address_id: number;
  };
};

export type MembersPaginateProperties = {
  per_page: number;
  total: number;
  current_page: number;
  data: MemberListItem[];
};

export interface ICreateMemberDTO {
  member_role_id: number;
  organization_id: number;
  name: string;
  email: string;
  description: string;
  lattes_url?: string | null;
  linked_in_url?: string | null;
  profile_picture?: string | null;
  password?: string | null;
}

export type MemberAuthPayload = {
  id: number;
  name: string;
  email: string;
  password: string;
  member_role: { id: number; name: string };
  organization: { id: number; name: string; logo: string; address_id: number };
};

export interface IUpdateMemberDTO extends ICreateMemberDTO {
  id: number;
}

export interface IMemberRepository {
  create(data: ICreateMemberDTO): Promise<void>;
  findAll(params: PaginateParams): Promise<MembersPaginateProperties>;
  findByIdWithRelations(id: number): Promise<MemberListItem | null>;

  findByEmail(email: string): Promise<{ id: number; email: string } | null>;

  update(data: IUpdateMemberDTO): Promise<void>;
  delete(id: number): Promise<void>;
  existsById(id: number): Promise<boolean>;
  findByEmailWithPassword(email: string): Promise<MemberAuthPayload | null>;
}

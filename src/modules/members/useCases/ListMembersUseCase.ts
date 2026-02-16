import { inject, injectable } from "tsyringe";
import { IMemberRepository, MembersPaginateProperties } from "../repositories/IMemberRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  member_role_id?: number;
  organization_id?: number;
};

@injectable()
export class ListMembersUseCase {
  constructor(
    @inject("MemberRepository")
    private memberRepository: IMemberRepository
  ) {}

  async execute(params: IRequest): Promise<MembersPaginateProperties> {
    const safePage = Number.isFinite(params.page) && params.page > 0 ? params.page : 1;
    const safeTake = Number.isFinite(params.take) && params.take > 0 && params.take <= 100 ? params.take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.memberRepository.findAll({
      search: params.search,
      page: safePage,
      skip,
      take: safeTake,
      member_role_id: params.member_role_id,
      organization_id: params.organization_id,
    });
  }
}

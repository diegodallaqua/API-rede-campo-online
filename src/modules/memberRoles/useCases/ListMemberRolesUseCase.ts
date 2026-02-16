import { inject, injectable } from "tsyringe";
import {
  IMemberRoleRepository,
  MemberRolesPaginateProperties,
} from "../repositories/IMemberRoleRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
};

@injectable()
export class ListMemberRolesUseCase {
  constructor(
    @inject("MemberRoleRepository")
    private memberRoleRepository: IMemberRoleRepository
  ) {}

  async execute({
    search,
    page,
    take,
  }: IRequest): Promise<MemberRolesPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.memberRoleRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}

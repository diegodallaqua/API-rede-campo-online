import { inject, injectable } from "tsyringe";
import {
  IContributorRoleRepository,
  ContributorRolePaginateProperties,
} from "../repositories/IContributorRoleRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
};

@injectable()
export class ListContributorRolesUseCase {
  constructor(
    @inject("ContributorRoleRepository")
    private ContributorRoleRepository: IContributorRoleRepository
  ) {}

  async execute({
    search,
    page,
    take,
  }: IRequest): Promise<ContributorRolePaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.ContributorRoleRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
    });
  }
}

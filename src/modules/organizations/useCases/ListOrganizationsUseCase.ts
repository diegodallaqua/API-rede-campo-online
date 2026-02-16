import { inject, injectable } from "tsyringe";
import {
  IOrganizationRepository,
  OrganizationsPaginateProperties,
} from "../repositories/IOrganizationRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  address_id?: number;
};

@injectable()
export class ListOrganizationsUseCase {
  constructor(
    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository
  ) {}

  async execute({
    search,
    page,
    take,
    address_id,
  }: IRequest): Promise<OrganizationsPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.organizationRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      address_id,
    });
  }
}

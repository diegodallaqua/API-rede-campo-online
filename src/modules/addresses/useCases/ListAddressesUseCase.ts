import { inject, injectable } from "tsyringe";
import { AddressesPaginateProperties, IAddressRepository } from "../repositories/IAddressRepository";

type IRequest = {
  search?: string;
  page: number;
  take: number;
  city_id?: number;
};

@injectable()
export class ListAddressesUseCase {
  constructor(
    @inject("AddressRepository")
    private addressRepository: IAddressRepository
  ) {}

  async execute({ search, page, take, city_id }: IRequest): Promise<AddressesPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    return this.addressRepository.findAll({
      search,
      page: safePage,
      skip,
      take: safeTake,
      city_id,
    });
  }
}

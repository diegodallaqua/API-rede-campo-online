import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Address } from "../entities/Address";
import { IAddressRepository } from "../repositories/IAddressRepository";
import { ICityRepository } from "../../cities/repositories/ICityRepository";

@injectable()
export class CreateAddressUseCase {
  constructor(
    @inject("AddressRepository")
    private addressesRepository: IAddressRepository,

    @inject("CityRepository")
    private citiesRepository: ICityRepository
  ) {}

  async execute(data: any): Promise<Address> {
    const city = await this.citiesRepository.findById(data.city_id);
    if (!city) {
      throw new AppError("City not found", 404);
    }

    const cep = data.cep.replace(/\D/g, "");

    if (cep.length !== 8) {
      throw new AppError("Invalid CEP format", 400);
    }

    return this.addressesRepository.create({
      ...data,
      cep,
    });
  }
}

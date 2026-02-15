import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Address } from "../entities/Address";
import { IAddressRepository, IUpdateAddressDTO } from "../repositories/IAddressRepository";
import { ICityRepository } from "../../cities/repositories/ICityRepository";

@injectable()
export class UpdateAddressUseCase {
  constructor(
    @inject("AddressRepository")
    private addressRepository: IAddressRepository,

    @inject("CityRepository")
    private cityRepository: ICityRepository
  ) {}

  async execute(data: IUpdateAddressDTO): Promise<Address> {
    const existing = await this.addressRepository.findById(data.id);
    if (!existing) {
      throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");
    }

    const city = await this.cityRepository.findById(data.city_id);
    if (!city) {
      throw new AppError("City not found", 404, "CITY_NOT_FOUND");
    }

    const cep = data.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      throw new AppError("Invalid CEP format", 400, "INVALID_CEP");
    }

    return this.addressRepository.update({
      ...data,
      street: data.street.trim(),
      neighborhood: data.neighborhood.trim(),
      complement: data.complement?.trim() ?? undefined,
      cep,
    });
  }
}

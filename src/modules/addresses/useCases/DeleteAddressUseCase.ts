import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IAddressRepository } from "../repositories/IAddressRepository";

@injectable()
export class DeleteAddressUseCase {
  constructor(
    @inject("AddressRepository")
    private addressRepository: IAddressRepository
  ) {}

  async execute(id: number): Promise<void> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");
    }

    await this.addressRepository.delete(id);
  }
}

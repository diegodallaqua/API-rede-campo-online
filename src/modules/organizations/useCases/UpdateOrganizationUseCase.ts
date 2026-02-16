import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Organization } from "../entities/Organization";
import { IOrganizationRepository } from "../repositories/IOrganizationRepository";
import { IAddressRepository } from "../../addresses/repositories/IAddressRepository";

type IRequest = {
  id: number;
  address_id: number;
  name: string;
  logo: string;
};

@injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository,

    @inject("AddressRepository")
    private addressRepository: IAddressRepository
  ) {}

  async execute({ id, address_id, name, logo }: IRequest): Promise<Organization> {
    const existing = await this.organizationRepository.findById(id);
    if (!existing) {
      throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
    }

    const address = await this.addressRepository.findById(address_id);
    if (!address) {
      throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");
    }

    const normalizedName = name.trim();
    const normalizedLogo = logo.trim();

    const conflict = await this.organizationRepository.findByName(normalizedName);
    if (conflict && conflict.id !== id) {
      throw new AppError("Organization name already in use", 409, "ORG_NAME_CONFLICT");
    }

    return this.organizationRepository.update({
      id,
      address_id,
      name: normalizedName,
      logo: normalizedLogo,
    });
  }
}

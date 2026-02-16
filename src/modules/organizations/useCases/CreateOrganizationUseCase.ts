import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { Organization } from "../entities/Organization";
import { IOrganizationRepository } from "../repositories/IOrganizationRepository";
import { IAddressRepository } from "../../addresses/repositories/IAddressRepository";

type IRequest = {
  address_id: number;
  name: string;
  logo: string;
};

@injectable()
export class CreateOrganizationUseCase {
  constructor(
    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository,

    @inject("AddressRepository")
    private addressRepository: IAddressRepository
  ) {}

  async execute({ address_id, name, logo }: IRequest): Promise<Organization> {
    const address = await this.addressRepository.findById(address_id);
    if (!address) {
      throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");
    }

    const normalizedName = name.trim();
    const normalizedLogo = logo.trim();

    const existing = await this.organizationRepository.findByName(normalizedName);
    if (existing) {
      throw new AppError("Organization already exists", 409, "ORG_ALREADY_EXISTS");
    }

    return this.organizationRepository.create({
      address_id,
      name: normalizedName,
      logo: normalizedLogo,
    });
  }
}

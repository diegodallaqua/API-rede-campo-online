import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IOrganizationRepository } from "../repositories/IOrganizationRepository";

@injectable()
export class DeleteOrganizationUseCase {
  constructor(
    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository
  ) {}

  async execute(id: number): Promise<void> {
    const org = await this.organizationRepository.findById(id);
    if (!org) {
      throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
    }

    await this.organizationRepository.delete(id);
  }
}

import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  IThesisRepository,
  IUpdateThesisDTO,
} from "../repositories/IThesisRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";
import { IOrganizationRepository } from "../../organizations/repositories/IOrganizationRepository";

@injectable()
export class UpdateThesisUseCase {
  constructor(
    @inject("ThesisRepository")
    private thesisRepository: IThesisRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository
  ) {}

  async execute(data: IUpdateThesisDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const organization = await this.organizationRepository.findById(data.organization_id);
    if (!organization) {
      throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
    }

    const exists = await this.thesisRepository.existsByPublicationId(
      data.publication_id
    );
    if (!exists) {
      throw new AppError("Thesis not found", 404, "THESIS_NOT_FOUND");
    }

    if (data.number_of_pages <= 0) {
      throw new AppError(
        "number_of_pages must be greater than zero",
        400,
        "INVALID_NUMBER_OF_PAGES"
      );
    }

    await this.thesisRepository.update({
      publication_id: data.publication_id,
      organization_id: data.organization_id,
      number_of_pages: data.number_of_pages,
    });
  }
}

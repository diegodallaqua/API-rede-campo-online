import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  ITechnicalReportRepository,
  ICreateTechnicalReportDTO,
} from "../repositories/ITechnicalReportRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";
import { IOrganizationRepository } from "../../organizations/repositories/IOrganizationRepository";

@injectable()
export class CreateTechnicalReportUseCase {
  constructor(
    @inject("TechnicalReportRepository")
    private technicalReportRepository: ITechnicalReportRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository
  ) {}

  async execute(data: ICreateTechnicalReportDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const organization = await this.organizationRepository.findById(data.organization_id);
    if (!organization) {
      throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
    }

    const alreadyExists = await this.technicalReportRepository.existsByPublicationId(
      data.publication_id
    );
    if (alreadyExists) {
      throw new AppError(
        "Technical report already exists for this publication",
        409,
        "TECHNICAL_REPORT_ALREADY_EXISTS"
      );
    }

    if (data.number_of_pages <= 0) {
      throw new AppError(
        "number_of_pages must be greater than zero",
        400,
        "INVALID_NUMBER_OF_PAGES"
      );
    }

    await this.technicalReportRepository.create({
      publication_id: data.publication_id,
      organization_id: data.organization_id,
      number_of_pages: data.number_of_pages,
    });
  }
}
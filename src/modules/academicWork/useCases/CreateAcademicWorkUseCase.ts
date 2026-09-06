import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  IAcademicWorkRepository,
  ICreateAcademicWorkDTO,
} from "../repositories/IAcademicWorkRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";
import { IOrganizationRepository } from "../../organizations/repositories/IOrganizationRepository";
import { IAcademicWorkTypeRepository } from "../../academicWorkTypes/repositories/IAcademicWorkTypeRepository";

@injectable()
export class CreateAcademicWorkUseCase {
  constructor(
    @inject("AcademicWorkRepository")
    private academicWorkRepository: IAcademicWorkRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("OrganizationRepository")
    private organizationRepository: IOrganizationRepository,

    @inject("AcademicWorkTypeRepository")
    private academicWorkTypeRepository: IAcademicWorkTypeRepository
  ) {}

  async execute(data: ICreateAcademicWorkDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const organization = await this.organizationRepository.findById(data.organization_id);
    if (!organization) {
      throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
    }

    const academicWorkType = await this.academicWorkTypeRepository.findById(
      data.academic_work_type_id
    );
    if (!academicWorkType) {
      throw new AppError(
        "Academic work type not found",
        404,
        "ACADEMIC_WORK_TYPE_NOT_FOUND"
      );
    }

    const alreadyExists = await this.academicWorkRepository.existsByPublicationId(
      data.publication_id
    );
    if (alreadyExists) {
      throw new AppError(
        "Academic work already exists for this publication",
        409,
        "ACADEMIC_WORK_ALREADY_EXISTS"
      );
    }

    if (data.number_of_pages <= 0) {
      throw new AppError(
        "number_of_pages must be greater than zero",
        400,
        "INVALID_NUMBER_OF_PAGES"
      );
    }

    await this.academicWorkRepository.create({
      publication_id: data.publication_id,
      organization_id: data.organization_id,
      academic_work_type_id: data.academic_work_type_id,
      defense_date: data.defense_date,
      number_of_pages: data.number_of_pages,
    });
  }
}

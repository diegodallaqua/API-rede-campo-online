import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IAcademicWorkRepository } from "../repositories/IAcademicWorkRepository";

@injectable()
export class DeleteAcademicWorkUseCase {
  constructor(
    @inject("AcademicWorkRepository")
    private academicWorkRepository: IAcademicWorkRepository
  ) {}

  async execute(publication_id: number): Promise<void> {
    const exists = await this.academicWorkRepository.existsByPublicationId(
      publication_id
    );

    if (!exists) {
      throw new AppError("Academic work not found", 404, "ACADEMIC_WORK_NOT_FOUND");
    }

    await this.academicWorkRepository.delete(publication_id);
  }
}

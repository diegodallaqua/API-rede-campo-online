import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { ITechnicalReportRepository } from "../repositories/ITechnicalReportRepository";

@injectable()
export class DeleteTechnicalReportUseCase {
  constructor(
    @inject("TechnicalReportRepository")
    private technicalReportRepository: ITechnicalReportRepository
  ) {}

  async execute(publication_id: number): Promise<void> {
    const exists = await this.technicalReportRepository.existsByPublicationId(
      publication_id
    );

    if (!exists) {
      throw new AppError("Technical report not found", 404, "TECHNICAL_REPORT_NOT_FOUND");
    }

    await this.technicalReportRepository.delete(publication_id);
  }
}
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IThesisRepository } from "../repositories/IThesisRepository";

@injectable()
export class DeleteThesisUseCase {
  constructor(
    @inject("ThesisRepository")
    private thesisRepository: IThesisRepository
  ) {}

  async execute(publication_id: number): Promise<void> {
    const exists = await this.thesisRepository.existsByPublicationId(
      publication_id
    );

    if (!exists) {
      throw new AppError("Thesis not found", 404, "THESIS_NOT_FOUND");
    }

    await this.thesisRepository.delete(publication_id);
  }
}

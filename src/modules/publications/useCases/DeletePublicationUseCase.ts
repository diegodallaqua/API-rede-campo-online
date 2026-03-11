import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IPublicationRepository } from "../repositories/IPublicationRepository";

@injectable()
export class DeletePublicationUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute(id: number): Promise<void> {
    const publication = await this.publicationRepository.findById(id);

    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    await this.publicationRepository.delete(id);
  }
}
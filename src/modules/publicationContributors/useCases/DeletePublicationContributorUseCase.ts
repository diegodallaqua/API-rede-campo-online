import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IPublicationContributorRepository } from "../repositories/IPublicationContributorRepository";

@injectable()
export class DeletePublicationContributorUseCase {
  constructor(
    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute(publication_id: number, author_order: number): Promise<void> {
    const exists = await this.publicationContributorRepository.existsById(
      publication_id,
      author_order
    );

    if (!exists) {
      throw new AppError(
        "Publication contributor not found",
        404,
        "PUBLICATION_CONTRIBUTOR_NOT_FOUND"
      );
    }

    await this.publicationContributorRepository.delete(publication_id, author_order);
  }
}
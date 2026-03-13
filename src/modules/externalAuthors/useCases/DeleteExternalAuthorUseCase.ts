import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IExternalAuthorRepository } from "../repositories/IExternalAuthorRepository";

@injectable()
export class DeleteExternalAuthorUseCase {
  constructor(
    @inject("ExternalAuthorRepository")
    private externalAuthorRepository: IExternalAuthorRepository
  ) {}

  async execute(id: number): Promise<void> {
    const externalAuthor = await this.externalAuthorRepository.findById(id);

    if (!externalAuthor) {
      throw new AppError("External author not found", 404, "EXTERNAL_AUTHOR_NOT_FOUND");
    }

    await this.externalAuthorRepository.delete(id);
  }
}
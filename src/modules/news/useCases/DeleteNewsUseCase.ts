import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewRepository } from "../repositories/INewRepository";

@injectable()
export class DeleteNewsUseCase {
  constructor(
    @inject("NewRepository")
    private newRepository: INewRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.newRepository.existsById(id);

    if (!exists) {
      throw new AppError("News not found", 404, "NEWS_NOT_FOUND");
    }

    await this.newRepository.delete(id);
  }
}
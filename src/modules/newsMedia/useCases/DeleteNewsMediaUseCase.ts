import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewsMediaRepository } from "../repositories/INewsMediaRepository";

@injectable()
export class DeleteNewsMediaUseCase {
  constructor(
    @inject("NewsMediaRepository")
    private newsMediaRepository: INewsMediaRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.newsMediaRepository.existsById(id);

    if (!exists) {
      throw new AppError("News media not found", 404, "NEWS_MEDIA_NOT_FOUND");
    }

    await this.newsMediaRepository.delete(id);
  }
}
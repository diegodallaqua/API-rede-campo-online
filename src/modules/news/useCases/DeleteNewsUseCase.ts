import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewsRepository } from "../repositories/INewsRepository";

@injectable()
export class DeleteNewsUseCase {
  constructor(
    @inject("NewsRepository")
    private newsRepository: INewsRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.newsRepository.existsById(id);

    if (!exists) {
      throw new AppError("News not found", 404, "NEWS_NOT_FOUND");
    }

    await this.newsRepository.delete(id);
  }
}
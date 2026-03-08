import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewsMediaRepository, ICreateNewsMediaDTO } from "../repositories/INewsMediaRepository";
import { INewsRepository } from "../../news/repositories/INewsRepository";

@injectable()
export class CreateNewsMediaUseCase {
  constructor(
    @inject("NewsMediaRepository")
    private newsMediaRepository: INewsMediaRepository,

    @inject("NewsRepository")
    private newsRepository: INewsRepository
  ) {}

  async execute(data: ICreateNewsMediaDTO): Promise<void> {
    const newsExists = await this.newsRepository.existsById(data.news_id);

    if (!newsExists) {
      throw new AppError("News not found", 404, "NEWS_NOT_FOUND");
    }

    await this.newsMediaRepository.create({
      news_id: data.news_id,
      name: data.name.trim(),
      media: data.media.trim(),
    });
  }
}
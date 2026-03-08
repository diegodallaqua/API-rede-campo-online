import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewsMediaRepository, IUpdateNewsMediaDTO } from "../repositories/INewsMediaRepository";
import { INewsRepository } from "../../news/repositories/INewsRepository";

@injectable()
export class UpdateNewsMediaUseCase {
  constructor(
    @inject("NewsMediaRepository")
    private newsMediaRepository: INewsMediaRepository,

    @inject("NewsRepository")
    private newsRepository: INewsRepository
  ) {}

  async execute(data: IUpdateNewsMediaDTO): Promise<void> {
    const exists = await this.newsMediaRepository.existsById(data.id);

    if (!exists) {
      throw new AppError("News media not found", 404, "NEWS_MEDIA_NOT_FOUND");
    }

    const newsExists = await this.newsRepository.existsById(data.news_id);

    if (!newsExists) {
      throw new AppError("News not found", 404, "NEWS_NOT_FOUND");
    }

    await this.newsMediaRepository.update({
      id: data.id,
      news_id: data.news_id,
      name: data.name.trim(),
      media: data.media.trim(),
    });
  }
}
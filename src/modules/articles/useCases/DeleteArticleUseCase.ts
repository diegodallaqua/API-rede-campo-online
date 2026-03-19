import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IArticleRepository } from "../repositories/IArticleRepository";

@injectable()
export class DeleteArticleUseCase {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository
  ) {}

  async execute(publication_id: number): Promise<void> {
    const exists = await this.articleRepository.existsByPublicationId(publication_id);

    if (!exists) {
      throw new AppError("Article not found", 404, "ARTICLE_NOT_FOUND");
    }

    await this.articleRepository.delete(publication_id);
  }
}
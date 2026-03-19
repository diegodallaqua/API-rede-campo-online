import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IArticleRepository, IUpdateArticleDTO } from "../repositories/IArticleRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";

@injectable()
export class UpdateArticleUseCase {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute(data: IUpdateArticleDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const exists = await this.articleRepository.existsByPublicationId(data.publication_id);
    if (!exists) {
      throw new AppError("Article not found", 404, "ARTICLE_NOT_FOUND");
    }

    await this.articleRepository.update({
      publication_id: data.publication_id,
      journal_name: data.journal_name.trim(),
      volume: data.volume?.trim() || null,
      issue: data.issue?.trim() || null,
      pages: data.pages?.trim() || null,
      publisher: data.publisher?.trim() || null,
    });
  }
}
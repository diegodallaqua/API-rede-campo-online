import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IArticleRepository, ICreateArticleDTO } from "../repositories/IArticleRepository";
import { IPublicationRepository } from "../../publications/repositories/IPublicationRepository";

@injectable()
export class CreateArticleUseCase {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository,

    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository
  ) {}

  async execute(data: ICreateArticleDTO): Promise<void> {
    const publication = await this.publicationRepository.findById(data.publication_id);
    if (!publication) {
      throw new AppError("Publication not found", 404, "PUBLICATION_NOT_FOUND");
    }

    const alreadyExists = await this.articleRepository.existsByPublicationId(
      data.publication_id
    );
    if (alreadyExists) {
      throw new AppError(
        "Article already exists for this publication",
        409,
        "ARTICLE_ALREADY_EXISTS"
      );
    }

    await this.articleRepository.create({
      publication_id: data.publication_id,
      journal_name: data.journal_name.trim(),
      volume: data.volume?.trim() || null,
      issue: data.issue?.trim() || null,
      pages: data.pages?.trim() || null,
      publisher: data.publisher?.trim() || null,
    });
  }
}
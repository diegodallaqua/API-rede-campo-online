import { inject, injectable } from "tsyringe";
import {
  IArticleRepository,
  ArticleEnrichedPaginateProperties,
} from "../repositories/IArticleRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IPublicationContributorRepository } from "../../publicationContributors/repositories/IPublicationContributorRepository";

type IRequest = {
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListArticlesUseCase {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute({
    title,
    page,
    take,
  }: IRequest): Promise<ArticleEnrichedPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const articles = await this.articleRepository.findAll({
      title,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData = await Promise.all(
      articles.data.map(async (article) => {
        const [research_areas, contributors] = await Promise.all([
          this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            article.publication.id
          ),
          this.publicationContributorRepository.findByPublicationId(
            article.publication.id
          ),
        ]);

        return {
          journal_name: article.journal_name,
          volume: article.volume,
          issue: article.issue,
          pages: article.pages,
          publisher: article.publisher,
          publication: {
            ...article.publication,
            research_areas,
            contributors,
          },
        };
      })
    );

    return {
      per_page: articles.per_page,
      total: articles.total,
      current_page: articles.current_page,
      data: enrichedData,
    };
  }
}

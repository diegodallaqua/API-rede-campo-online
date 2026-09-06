import { inject, injectable } from "tsyringe";
import {
  IBookChapterRepository,
  BookChapterEnrichedPaginateProperties,
} from "../repositories/IBookChapterRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IPublicationContributorRepository } from "../../publicationContributors/repositories/IPublicationContributorRepository";

type IRequest = {
  title?: string;
  book_id?: number;
  page: number;
  take: number;
};

@injectable()
export class ListBookChaptersUseCase {
  constructor(
    @inject("BookChapterRepository")
    private bookChapterRepository: IBookChapterRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute({
    title,
    book_id,
    page,
    take,
  }: IRequest): Promise<BookChapterEnrichedPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const bookChapters = await this.bookChapterRepository.findAll({
      title,
      book_id,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData = await Promise.all(
      bookChapters.data.map(async (chapter) => {
        const [research_areas, contributors] = await Promise.all([
          this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            chapter.publication.id
          ),
          this.publicationContributorRepository.findByPublicationId(
            chapter.publication.id
          ),
        ]);

        return {
          book_name: chapter.book_name,
          chapter_number: chapter.chapter_number,
          isbn: chapter.isbn,
          start_page: chapter.start_page,
          end_page: chapter.end_page,
          book: chapter.book,
          publication: {
            ...chapter.publication,
            research_areas,
            contributors,
          },
        };
      })
    );

    return {
      per_page: bookChapters.per_page,
      total: bookChapters.total,
      current_page: bookChapters.current_page,
      data: enrichedData,
    };
  }
}
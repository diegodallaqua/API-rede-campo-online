import { inject, injectable } from "tsyringe";
import {
  IBookRepository,
  BookEnrichedPaginateProperties,
} from "../repositories/IBookRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IPublicationContributorRepository } from "../../publicationContributors/repositories/IPublicationContributorRepository";

type IRequest = {
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListBooksUseCase {
  constructor(
    @inject("BookRepository")
    private bookRepository: IBookRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute({
    title,
    page,
    take,
  }: IRequest): Promise<BookEnrichedPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const books = await this.bookRepository.findAll({
      title,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData = await Promise.all(
      books.data.map(async (book) => {
        const [research_areas, contributors] = await Promise.all([
          this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            book.publication.id
          ),
          this.publicationContributorRepository.findByPublicationId(
            book.publication.id
          ),
        ]);

        return {
          publisher: book.publisher,
          edition: book.edition,
          cover_photo: book.cover_photo,
          isbn: book.isbn,
          book_url: book.book_url,
          publication: {
            ...book.publication,
            research_areas,
            contributors,
          },
        };
      })
    );

    return {
      per_page: books.per_page,
      total: books.total,
      current_page: books.current_page,
      data: enrichedData,
    };
  }
}

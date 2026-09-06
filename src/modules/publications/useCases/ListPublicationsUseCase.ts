import { inject, injectable } from "tsyringe";
import {
  IPublicationRepository,
  PublicationWithResearchAreasPaginateProperties,
  PublicationWithResearchAreas,
  PublicationTypeDetails,
} from "../repositories/IPublicationRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IPublicationContributorRepository } from "../../publicationContributors/repositories/IPublicationContributorRepository";
import { IArticleRepository } from "../../articles/repositories/IArticleRepository";
import { IBookRepository } from "../../books/repositories/IBookRepository";
import { IBookChapterRepository } from "../../bookChapters/repositories/IBookChapterRepository";
import { IAcademicWorkRepository } from "../../academicWork/repositories/IAcademicWorkRepository";
import { toPublicationProject } from "../mappers/toPublicationProject";

type IRequest = {
  title?: string;
  project_id?: number;
  page: number;
  take: number;
};

@injectable()
export class ListPublicationsUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository,

    @inject("ArticleRepository")
    private articleRepository: IArticleRepository,

    @inject("BookRepository")
    private bookRepository: IBookRepository,

    @inject("BookChapterRepository")
    private bookChapterRepository: IBookChapterRepository,

    @inject("AcademicWorkRepository")
    private academicWorkRepository: IAcademicWorkRepository
  ) {}

  private async resolveTypeDetails(
    publication_id: number
  ): Promise<PublicationTypeDetails | null> {
    const [article, book, bookChapter, academicWork] = await Promise.all([
      this.articleRepository.findByIdWithRelations(publication_id),
      this.bookRepository.findByIdWithRelations(publication_id),
      this.bookChapterRepository.findByIdWithRelations(publication_id),
      this.academicWorkRepository.findByIdWithRelations(publication_id),
    ]);

    if (article) {
      return {
        type: "article",
        journal_name: article.journal_name,
        volume: article.volume,
        issue: article.issue,
        pages: article.pages,
        publisher: article.publisher,
      };
    }

    if (book) {
      return {
        type: "book",
        publisher: book.publisher,
        edition: book.edition,
        cover_photo: book.cover_photo,
        isbn: book.isbn,
        book_url: book.book_url,
      };
    }

    if (bookChapter) {
      return {
        type: "book_chapter",
        book_name: bookChapter.book_name,
        chapter_number: bookChapter.chapter_number,
        isbn: bookChapter.isbn,
        start_page: bookChapter.start_page,
        end_page: bookChapter.end_page,
        book: bookChapter.book,
      };
    }

    if (academicWork) {
      return {
        type: "academic_work",
        number_of_pages: academicWork.number_of_pages,
        defense_date: academicWork.defense_date,
        organization: academicWork.organization,
        academic_work_type: academicWork.academic_work_type,
      };
    }

    return null;
  }

  async execute({
    title,
    project_id,
    page,
    take,
  }: IRequest): Promise<PublicationWithResearchAreasPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const publications = await this.publicationRepository.findAll({
      title,
      project_id,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData: PublicationWithResearchAreas[] = await Promise.all(
      publications.data.map(async (publication) => {
        const [researchAreas, contributors, details] = await Promise.all([
          this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            publication.id
          ),
          this.publicationContributorRepository.findByPublicationId(
            publication.id
          ),
          this.resolveTypeDetails(publication.id),
        ]);

        return {
          id: publication.id,
          title: publication.title,
          abstract: publication.abstract,
          publication_date: publication.publication_date,
          doi: publication.doi ?? null,
          project: toPublicationProject(publication.project),
          details,
          research_areas: researchAreas,
          contributors,
        };
      })
    );

    return {
      per_page: publications.per_page,
      total: publications.total,
      current_page: publications.current_page,
      data: enrichedData,
    };
  }
}

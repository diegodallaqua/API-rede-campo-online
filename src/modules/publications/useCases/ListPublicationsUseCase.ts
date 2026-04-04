import { inject, injectable } from "tsyringe";
import {
  IPublicationRepository,
  PublicationWithResearchAreasPaginateProperties,
  PublicationWithResearchAreas,
} from "../repositories/IPublicationRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";

type IRequest = {
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListPublicationsUseCase {
  constructor(
    @inject("PublicationRepository")
    private publicationRepository: IPublicationRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository
  ) {}

  async execute({
    title,
    page,
    take,
  }: IRequest): Promise<PublicationWithResearchAreasPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const publications = await this.publicationRepository.findAll({
      title,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData: PublicationWithResearchAreas[] = await Promise.all(
      publications.data.map(async (publication) => {
        const researchAreas =
          await this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            publication.id
          );

        return {
          id: publication.id,
          title: publication.title,
          abstract: publication.abstract,
          publication_date: publication.publication_date,
          doi: publication.doi ?? null,
          research_areas: researchAreas,
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
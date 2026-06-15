import { inject, injectable } from "tsyringe";
import {
  IThesisRepository,
  ThesisEnrichedPaginateProperties,
} from "../repositories/IThesisRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IPublicationContributorRepository } from "../../publicationContributors/repositories/IPublicationContributorRepository";

type IRequest = {
  title?: string;
  organization_id?: number;
  page: number;
  take: number;
};

@injectable()
export class ListThesisUseCase {
  constructor(
    @inject("ThesisRepository")
    private thesisRepository: IThesisRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute({
    title,
    organization_id,
    page,
    take,
  }: IRequest): Promise<ThesisEnrichedPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const theses = await this.thesisRepository.findAll({
      title,
      organization_id,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData = await Promise.all(
      theses.data.map(async (thesis) => {
        const [research_areas, contributors] = await Promise.all([
          this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            thesis.publication.id
          ),
          this.publicationContributorRepository.findByPublicationId(
            thesis.publication.id
          ),
        ]);

        return {
          number_of_pages: thesis.number_of_pages,
          organization: thesis.organization,
          publication: {
            ...thesis.publication,
            research_areas,
            contributors,
          },
        };
      })
    );

    return {
      per_page: theses.per_page,
      total: theses.total,
      current_page: theses.current_page,
      data: enrichedData,
    };
  }
}

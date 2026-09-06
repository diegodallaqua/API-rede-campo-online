import { inject, injectable } from "tsyringe";
import {
  IAcademicWorkRepository,
  AcademicWorkEnrichedPaginateProperties,
} from "../repositories/IAcademicWorkRepository";
import { IPublicationHasResearchAreasRepository } from "../../publicationHasResearchAreas/repositories/IPublicationHasResearchAreaRepository";
import { IPublicationContributorRepository } from "../../publicationContributors/repositories/IPublicationContributorRepository";

type IRequest = {
  title?: string;
  organization_id?: number;
  academic_work_type_id?: number;
  page: number;
  take: number;
};

@injectable()
export class ListAcademicWorkUseCase {
  constructor(
    @inject("AcademicWorkRepository")
    private academicWorkRepository: IAcademicWorkRepository,

    @inject("PublicationHasResearchAreasRepository")
    private publicationHasResearchAreasRepository: IPublicationHasResearchAreasRepository,

    @inject("PublicationContributorRepository")
    private publicationContributorRepository: IPublicationContributorRepository
  ) {}

  async execute({
    title,
    organization_id,
    academic_work_type_id,
    page,
    take,
  }: IRequest): Promise<AcademicWorkEnrichedPaginateProperties> {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeTake = Number.isFinite(take) && take > 0 && take <= 100 ? take : 10;

    const skip = (safePage - 1) * safeTake;

    const academicWorks = await this.academicWorkRepository.findAll({
      title,
      organization_id,
      academic_work_type_id,
      page: safePage,
      skip,
      take: safeTake,
    });

    const enrichedData = await Promise.all(
      academicWorks.data.map(async (academicWork) => {
        const [research_areas, contributors] = await Promise.all([
          this.publicationHasResearchAreasRepository.findResearchAreasByPublicationId(
            academicWork.publication.id
          ),
          this.publicationContributorRepository.findByPublicationId(
            academicWork.publication.id
          ),
        ]);

        return {
          number_of_pages: academicWork.number_of_pages,
          defense_date: academicWork.defense_date,
          organization: academicWork.organization,
          academic_work_type: academicWork.academic_work_type,
          publication: {
            ...academicWork.publication,
            research_areas,
            contributors,
          },
        };
      })
    );

    return {
      per_page: academicWorks.per_page,
      total: academicWorks.total,
      current_page: academicWorks.current_page,
      data: enrichedData,
    };
  }
}

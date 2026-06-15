import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewsRepository, NewsListItem } from "../repositories/INewsRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IResearchAreaRepository } from "../../researchAreas/repositories/IResearchAreaRepository";
import { INewsHasResearchAreasRepository } from "../../newsHasResearchAreas/repositories/INewsHasResearchAreaRepository";

type IRequest = {
  member_id: number;
  title: string;
  description: string;
  content: string;
  publication_date: string;
  research_area_ids?: number[];
};

@injectable()
export class CreateNewsUseCase {
  constructor(
    @inject("NewsRepository")
    private newsRepository: INewsRepository,

    @inject("MemberRepository")
    private memberRepository: IMemberRepository,

    @inject("ResearchAreaRepository")
    private researchAreaRepository: IResearchAreaRepository,

    @inject("NewsHasResearchAreasRepository")
    private newsHasResearchAreasRepository: INewsHasResearchAreasRepository
  ) {}

  async execute({
    member_id,
    title,
    description,
    content,
    publication_date,
    research_area_ids = [],
  }: IRequest): Promise<NewsListItem> {
    const memberExists = await this.memberRepository.existsById(member_id);
    if (!memberExists) {
      throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");
    }

    const publicationDate = new Date(publication_date);
    if (Number.isNaN(publicationDate.getTime())) {
      throw new AppError("Invalid publication_date", 400, "INVALID_PUBLICATION_DATE");
    }

    const uniqueResearchAreaIds = [...new Set(research_area_ids)];

    for (const researchAreaId of uniqueResearchAreaIds) {
      const researchArea = await this.researchAreaRepository.findById(researchAreaId);
      if (!researchArea) {
        throw new AppError(
          `Research area ${researchAreaId} not found`,
          404,
          "RESEARCH_AREA_NOT_FOUND"
        );
      }
    }

    const createdNews = await this.newsRepository.create({
      member_id,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      publication_date,
    });

    await this.newsHasResearchAreasRepository.createMany(
      uniqueResearchAreaIds.map((research_area_id) => ({
        research_area_id,
        news_id: createdNews.id,
      }))
    );

    const news = await this.newsRepository.findByIdWithRelations(createdNews.id);
    const researchAreas = await this.newsHasResearchAreasRepository.findResearchAreasByNewsId(createdNews.id);

    return { ...news!, research_areas: researchAreas };
  }
}

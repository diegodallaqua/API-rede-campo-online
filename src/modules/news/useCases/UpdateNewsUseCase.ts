import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewsRepository } from "../repositories/INewsRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IResearchAreaRepository } from "../../researchAreas/repositories/IResearchAreaRepository";
import { INewsHasResearchAreasRepository } from "../../newsHasResearchAreas/repositories/INewsHasResearchAreaRepository";

type IRequest = {
  id: number;
  member_id: number;
  title: string;
  description: string;
  content: string;
  publication_date: string;
  research_area_ids?: number[];
};

@injectable()
export class UpdateNewsUseCase {
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
    id,
    member_id,
    title,
    description,
    content,
    publication_date,
    research_area_ids = [],
  }: IRequest): Promise<void> {
    const exists = await this.newsRepository.existsById(id);
    if (!exists) {
      throw new AppError("News not found", 404, "NEWS_NOT_FOUND");
    }

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

    await this.newsRepository.update({
      id,
      member_id,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      publication_date: publicationDate,
    });

    await this.newsHasResearchAreasRepository.deleteByNewsId(id);

    await this.newsHasResearchAreasRepository.createMany(
      uniqueResearchAreaIds.map((research_area_id) => ({
        research_area_id,
        news_id: id,
      }))
    );
  }
}

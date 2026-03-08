import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { INewRepository, ICreateNewsDTO } from "../repositories/INewRepository";
import { IProjectRepository } from "../../projects/repositories/IProjectRepository";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";

@injectable()
export class CreateNewsUseCase {
  constructor(
    @inject("NewRepository")
    private newRepository: INewRepository,

    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,

    @inject("MemberRepository")
    private memberRepository: IMemberRepository
  ) {}

  async execute(data: ICreateNewsDTO): Promise<void> {
    const memberExists = await this.memberRepository.existsById(data.member_id);
    if (!memberExists) {
      throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");
    }

    if (data.project_id) {
      const projectExists = await this.projectRepository.existsById(data.project_id);
      if (!projectExists) {
        throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
      }
    }

    const publicationDate = new Date(data.publication_date);
    if (Number.isNaN(publicationDate.getTime())) {
      throw new AppError("Invalid publication_date", 400, "INVALID_PUBLICATION_DATE");
    }

    await this.newRepository.create({
      project_id: data.project_id ?? null,
      member_id: data.member_id,
      title: data.title.trim(),
      description: data.description.trim(),
      content: data.content.trim(),
      publication_date: data.publication_date,
    });
  }
}
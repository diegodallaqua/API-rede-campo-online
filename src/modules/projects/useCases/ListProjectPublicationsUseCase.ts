import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IProjectRepository } from "../repositories/IProjectRepository";
import { PublicationWithResearchAreasPaginateProperties } from "../../publications/repositories/IPublicationRepository";
import { ListPublicationsUseCase } from "../../publications/useCases/ListPublicationsUseCase";

type IRequest = {
  project_id: number;
  title?: string;
  page: number;
  take: number;
};

@injectable()
export class ListProjectPublicationsUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,

    private listPublicationsUseCase: ListPublicationsUseCase
  ) {}

  async execute({
    project_id,
    title,
    page,
    take,
  }: IRequest): Promise<PublicationWithResearchAreasPaginateProperties> {
    const projectExists = await this.projectRepository.existsById(project_id);

    if (!projectExists) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }

    return this.listPublicationsUseCase.execute({
      project_id,
      title,
      page,
      take,
    });
  }
}

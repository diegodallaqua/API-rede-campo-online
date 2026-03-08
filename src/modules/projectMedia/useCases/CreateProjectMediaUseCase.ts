import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { ProjectMedia } from "../entities/ProjectMedia";
import { IProjectMediaRepository, ICreateProjectMediaDTO } from "../repositories/IProjectMediaRepository";
import { IProjectRepository } from "../../projects/repositories/IProjectRepository";

@injectable()
export class CreateProjectMediaUseCase {
  constructor(
    @inject("ProjectMediaRepository")
    private projectMediaRepository: IProjectMediaRepository,

    @inject("ProjectRepository")
    private projectRepository: IProjectRepository
  ) {}

  async execute(data: ICreateProjectMediaDTO): Promise<ProjectMedia> {
    const existsProject = await this.projectRepository.existsById(data.project_id);
    if (!existsProject) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }

    return this.projectMediaRepository.create({
      project_id: data.project_id,
      name: data.name.trim(),
      media: data.media.trim(),
    });
  }
}
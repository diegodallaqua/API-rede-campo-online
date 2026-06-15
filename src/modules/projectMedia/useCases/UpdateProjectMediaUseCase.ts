import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import {
  IProjectMediaRepository,
  IUpdateProjectMediaDTO,
  ProjectMediaListItem,
} from "../repositories/IProjectMediaRepository";
import { IProjectRepository } from "../../projects/repositories/IProjectRepository";

@injectable()
export class UpdateProjectMediaUseCase {
  constructor(
    @inject("ProjectMediaRepository")
    private projectMediaRepository: IProjectMediaRepository,

    @inject("ProjectRepository")
    private projectRepository: IProjectRepository
  ) {}

  async execute(data: IUpdateProjectMediaDTO): Promise<ProjectMediaListItem> {
    const exists = await this.projectMediaRepository.existsById(data.id);
    if (!exists) throw new AppError("Project media not found", 404, "PROJECT_MEDIA_NOT_FOUND");

    const existsProject = await this.projectRepository.existsById(data.project_id);
    if (!existsProject) throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");

    return this.projectMediaRepository.update({
      id: data.id,
      project_id: data.project_id,
      name: data.name.trim(),
      media: data.media.trim(),
    });
  }
}
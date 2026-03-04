import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IProjectRepository } from "../repositories/IProjectRepository";

@injectable()
export class DeleteProjectUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.projectRepository.existsById(id);
    if (!exists) throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    await this.projectRepository.delete(id);
  }
}
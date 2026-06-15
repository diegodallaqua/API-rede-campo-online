import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IProjectRepository } from "../repositories/IProjectRepository";
import { IProjectHasMembersRepository } from "../../projectHasMembers/repositories/IProjectHasMembersRepository";
import { IProjectHasResearchAreasRepository } from "../../projectHasResearchAreas/repositories/IProjectHasResearchAreaRepository";

@injectable()
export class DeleteProjectUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,
    @inject("ProjectHasMembersRepository")
    private projectHasMembersRepository: IProjectHasMembersRepository,
    @inject("ProjectHasResearchAreasRepository")
    private projectHasResearchAreasRepository: IProjectHasResearchAreasRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.projectRepository.existsById(id);
    if (!exists) throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    await this.projectHasMembersRepository.deleteByProjectId(id);
    await this.projectHasResearchAreasRepository.deleteByProjectId(id);
    await this.projectRepository.delete(id);
  }
}
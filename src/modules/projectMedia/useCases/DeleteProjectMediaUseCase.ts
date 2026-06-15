import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IProjectMediaRepository } from "../repositories/IProjectMediaRepository";

@injectable()
export class DeleteProjectMediaUseCase {
  constructor(
    @inject("ProjectMediaRepository")
    private projectMediaRepository: IProjectMediaRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.projectMediaRepository.existsById(id);
    if (!exists) throw new AppError("Project media not found", 404, "PROJECT_MEDIA_NOT_FOUND");

    await this.projectMediaRepository.delete(id);
  }
}
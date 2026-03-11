import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IProjectRepository, ICreateProjectDTO } from "../repositories/IProjectRepository";
import { IProjectTypeRepository } from "../../projectTypes/repositories/IProjectTypeRepository";

@injectable()
export class CreateProjectUseCase {
  constructor(
    @inject("ProjectRepository")
    private projectRepository: IProjectRepository,

    @inject("ProjectTypeRepository")
    private projectTypeRepository: IProjectTypeRepository
  ) {}

  async execute(data: ICreateProjectDTO): Promise<void> {
    const type = await this.projectTypeRepository.findById(data.project_type_id);
    if (!type) throw new AppError("Project type not found", 404, "PROJECT_TYPE_NOT_FOUND");

    const begin = data.begin_date;
    const end = data.end_date ?? null;

    if (end && end < begin) {
      throw new AppError("end_date cannot be before begin_date", 400, "INVALID_DATE_RANGE");
    }

    await this.projectRepository.create({
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      end_date: end,
    });
  }
}
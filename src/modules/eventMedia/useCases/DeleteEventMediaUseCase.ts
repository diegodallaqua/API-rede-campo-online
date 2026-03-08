import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IEventMediaRepository } from "../repositories/IEventMediaRepository";

@injectable()
export class DeleteEventMediaUseCase {
  constructor(
    @inject("EventMediaRepository")
    private eventMediaRepository: IEventMediaRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.eventMediaRepository.existsById(id);
    if (!exists) throw new AppError("Event media not found", 404, "EVENT_MEDIA_NOT_FOUND");
    await this.eventMediaRepository.delete(id);
  }
}
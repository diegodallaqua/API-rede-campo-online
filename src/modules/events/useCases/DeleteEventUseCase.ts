import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IEventRepository } from "../repositories/IEventRepository";

@injectable()
export class DeleteEventUseCase {
  constructor(
    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.eventRepository.existsById(id);
    if (!exists) throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");
    await this.eventRepository.delete(id);
  }
}
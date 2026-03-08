import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IEventMediaRepository, IUpdateEventMediaDTO } from "../repositories/IEventMediaRepository";
import { IEventRepository } from "../../events/repositories/IEventRepository";

@injectable()
export class UpdateEventMediaUseCase {
  constructor(
    @inject("EventMediaRepository")
    private eventMediaRepository: IEventMediaRepository,

    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute(data: IUpdateEventMediaDTO): Promise<void> {
    const exists = await this.eventMediaRepository.existsById(data.id);
    if (!exists) throw new AppError("Event media not found", 404, "EVENT_MEDIA_NOT_FOUND");

    const eventExists = await this.eventRepository.existsById(data.event_id);
    if (!eventExists) throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");

    await this.eventMediaRepository.update({
      id: data.id,
      event_id: data.event_id,
      name: data.name.trim(),
      media: data.media.trim(),
    });
  }
}
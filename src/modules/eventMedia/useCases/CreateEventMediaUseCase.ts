import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IEventMediaRepository, ICreateEventMediaDTO } from "../repositories/IEventMediaRepository";
import { IEventRepository } from "../../events/repositories/IEventRepository";

@injectable()
export class CreateEventMediaUseCase {
  constructor(
    @inject("EventMediaRepository")
    private eventMediaRepository: IEventMediaRepository,

    @inject("EventRepository")
    private eventRepository: IEventRepository
  ) {}

  async execute(data: ICreateEventMediaDTO): Promise<void> {
    const eventExists = await this.eventRepository.existsById(data.event_id);
    if (!eventExists) throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");

    await this.eventMediaRepository.create({
      event_id: data.event_id,
      name: data.name.trim(),
      media: data.media.trim(),
    });
  }
}
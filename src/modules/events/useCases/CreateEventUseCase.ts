import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { EventListItem, ICreateEventDTO, IEventRepository } from "../repositories/IEventRepository";
import { IAddressRepository } from "../../addresses/repositories/IAddressRepository";
import { IProjectRepository } from "../../projects/repositories/IProjectRepository";

@injectable()
export class CreateEventUseCase {
  constructor(
    @inject("EventRepository")
    private eventRepository: IEventRepository,

    @inject("AddressRepository")
    private addressRepository: IAddressRepository,

    @inject("ProjectRepository")
    private projectRepository: IProjectRepository
  ) {}

  async execute(data: ICreateEventDTO): Promise<EventListItem> {
    const address = await this.addressRepository.findById(data.address_id);
    if (!address) throw new AppError("Address not found", 404, "ADDRESS_NOT_FOUND");

    const projectExists = await this.projectRepository.existsById(data.project_id);
    if (!projectExists) throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");

    const dateObj = new Date(data.date);
    if (Number.isNaN(dateObj.getTime())) {
      throw new AppError("Invalid date", 400, "INVALID_DATE");
    }

    const id = await this.eventRepository.create({
      address_id: data.address_id,
      project_id: data.project_id,
      name: data.name.trim(),
      date: dateObj,
      description: data.description?.trim() ?? null,
      registration_url: data.registration_url?.trim() ?? null,
    });

    const event = await this.eventRepository.findByIdWithRelations(id);
    if (!event) throw new AppError("Event not found", 404, "EVENT_NOT_FOUND");

    return event;
  }
}
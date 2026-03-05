import { container } from "tsyringe";
import { IEventRepository } from "../repositories/IEventRepository";
import { EventRepository } from "../repositories/EventRepository";

container.registerSingleton<IEventRepository>(
  "EventRepository",
  EventRepository
);
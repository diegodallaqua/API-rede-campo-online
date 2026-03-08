import { container } from "tsyringe";
import { IEventMediaRepository } from "../repositories/IEventMediaRepository";
import { EventMediaRepository } from "../repositories/EventMediaRepository";

container.registerSingleton<IEventMediaRepository>(
  "EventMediaRepository",
  EventMediaRepository
);
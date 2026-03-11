import { container } from "tsyringe";
import { IPublicationRepository } from "../repositories/IPublicationRepository";
import { PublicationRepository } from "../repositories/PublicationsRepository";

container.registerSingleton<IPublicationRepository>(
  "PublicationRepository",
  PublicationRepository
);
import { container } from "tsyringe";
import { IPublicationHasResearchAreasRepository } from "../repositories/IPublicationHasResearchAreaRepository";
import { PublicationHasResearchAreasRepository } from "../repositories/PublicationHasResearchAreasRepository";

container.registerSingleton<IPublicationHasResearchAreasRepository>(
  "PublicationHasResearchAreasRepository",
  PublicationHasResearchAreasRepository
);
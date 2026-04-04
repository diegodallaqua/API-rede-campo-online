import { container } from "tsyringe";
import { IProjectHasResearchAreasRepository } from "../repositories/IProjectHasResearchAreaRepository";
import { ProjectHasResearchAreasRepository } from "../repositories/NewsHasResearchAreasRepository";

container.registerSingleton<IProjectHasResearchAreasRepository>(
  "ProjectHasResearchAreasRepository",
  ProjectHasResearchAreasRepository
);
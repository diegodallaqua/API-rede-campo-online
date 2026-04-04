import { container } from "tsyringe";
import { IProjectHasResearchAreasRepository } from "../repositories/IProjectHasResearchAreaRepository";
import { ProjectHasResearchAreasRepository } from "../repositories/ProjectHasResearchAreasRepository";

container.registerSingleton<IProjectHasResearchAreasRepository>(
  "ProjectHasResearchAreasRepository",
  ProjectHasResearchAreasRepository
);
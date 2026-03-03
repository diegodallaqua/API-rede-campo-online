import { container } from "tsyringe";
import { IProjectTypeRepository } from "../repositories/IProjectTypeRepository";
import { ProjectTypeRepository } from "../repositories/ProjectTypeRepository";

container.registerSingleton<IProjectTypeRepository>(
  "ProjectTypeRepository",
  ProjectTypeRepository
);

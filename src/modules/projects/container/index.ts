import { container } from "tsyringe";
import { IProjectRepository } from "../repositories/IProjectRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";

container.registerSingleton<IProjectRepository>(
  "ProjectRepository",
  ProjectRepository
);
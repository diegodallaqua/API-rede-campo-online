import { container } from "tsyringe";
import { IProjectsRepository } from "../repositories/IProjectRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";

container.registerSingleton<IProjectsRepository>(
  "ProjectRepository",
  ProjectRepository
);
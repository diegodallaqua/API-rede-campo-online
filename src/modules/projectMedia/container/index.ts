import { container } from "tsyringe";
import { IProjectMediaRepository } from "../repositories/IProjectMediaRepository";
import { ProjectMediaRepository } from "../repositories/ProjectMediaRepository";

container.registerSingleton<IProjectMediaRepository>(
  "ProjectMediaRepository",
  ProjectMediaRepository
);
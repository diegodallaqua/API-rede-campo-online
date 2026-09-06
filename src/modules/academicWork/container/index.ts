import { container } from "tsyringe";
import { IAcademicWorkRepository } from "../repositories/IAcademicWorkRepository";
import { AcademicWorkRepository } from "../repositories/AcademicWorkRepository";

container.registerSingleton<IAcademicWorkRepository>(
  "AcademicWorkRepository",
  AcademicWorkRepository
);

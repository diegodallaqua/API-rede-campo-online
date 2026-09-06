import { container } from "tsyringe";
import { IAcademicWorkTypeRepository } from "../repositories/IAcademicWorkTypeRepository";
import { AcademicWorkTypeRepository } from "../repositories/AcademicWorkTypeRepository";

container.registerSingleton<IAcademicWorkTypeRepository>(
  "AcademicWorkTypeRepository",
  AcademicWorkTypeRepository
);

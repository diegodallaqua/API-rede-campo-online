import { container } from "tsyringe";
import { IResearchAreaRepository } from "../repositories/IResearchAreaRepository";
import { ResearchAreaRepository } from "../repositories/ResearchAreaRepository";

container.registerSingleton<IResearchAreaRepository>(
  "ResearchAreaRepository",
  ResearchAreaRepository
);

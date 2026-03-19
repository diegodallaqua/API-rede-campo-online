import { container } from "tsyringe";
import { ITechnicalReportRepository } from "../repositories/ITechnicalReportRepository";
import { TechnicalReportRepository } from "../repositories/TechnicalReportsRepository";

container.registerSingleton<ITechnicalReportRepository>(
  "TechnicalReportRepository",
  TechnicalReportRepository
);
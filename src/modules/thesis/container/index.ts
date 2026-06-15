import { container } from "tsyringe";
import { IThesisRepository } from "../repositories/IThesisRepository";
import { ThesisRepository } from "../repositories/ThesisRepository";

container.registerSingleton<IThesisRepository>(
  "ThesisRepository",
  ThesisRepository
);

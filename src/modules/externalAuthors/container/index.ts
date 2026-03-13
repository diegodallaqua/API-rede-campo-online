import { container } from "tsyringe";
import { IExternalAuthorRepository } from "../repositories/IExternalAuthorRepository";
import { ExternalAuthorRepository } from "../repositories/ExternalAuthorRepository";

container.registerSingleton<IExternalAuthorRepository>(
  "ExternalAuthorRepository",
  ExternalAuthorRepository
);
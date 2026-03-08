import { container } from "tsyringe";
import { INewRepository } from "../repositories/INewRepository";
import { NewRepository } from "../repositories/NewRepository";

container.registerSingleton<INewRepository>(
  "NewRepository",
  NewRepository
);
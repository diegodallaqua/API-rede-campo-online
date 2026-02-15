import { container } from "tsyringe";
import { IStatesRepository } from "../repositories/IStatesRepository";
import { StatesRepository } from "../repositories/StatesRepository";

container.registerSingleton<IStatesRepository>("StatesRepository", StatesRepository);
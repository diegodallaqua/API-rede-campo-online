import { container } from "tsyringe";
import { ICityRepository } from "../repositories/ICityRepository";
import { CityRepository } from "../repositories/CityRepository";

container.registerSingleton<ICityRepository>("CityRepository", CityRepository);

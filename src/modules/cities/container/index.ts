import { container } from "tsyringe";
import { ICityRepository } from "../repositories/ICityRepository";
import { CityRepository } from "../repositories/CitiesRepository";

container.registerSingleton<ICityRepository>("CityRepository", CityRepository);

import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { City } from "../entities/City";
import { ICityRepository } from "../repositories/ICityRepository";
import { IStatesRepository } from "../../states/repositories/IStatesRepository";

type IRequest = {
  state_id: number;
  name: string;
};

@injectable()
export class CreateCityUseCase {
  constructor(
    @inject("CityRepository")
    private citiesRepository: ICityRepository,

    @inject("StatesRepository")
    private statesRepository: IStatesRepository
  ) {}

  async execute({ state_id, name }: IRequest): Promise<City> {
    const state = await this.statesRepository.findById(state_id);
    if (!state) {
      throw new AppError("State not found", 404, "STATE_NOT_FOUND");
    }

    const normalized = name.trim();

    const exists = await this.citiesRepository.findByNameInState(state_id, normalized);
    if (exists) {
      throw new AppError("City already exists in this state", 409, "CITY_ALREADY_EXISTS");
    }

    return this.citiesRepository.create({ state_id, name: normalized });
  }
}

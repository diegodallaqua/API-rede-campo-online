import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { City } from "../entities/City";
import { ICityRepository } from "../repositories/ICityRepository";
import { IStatesRepository } from "../../states/repositories/IStatesRepository";

type IRequest = {
  id: number;
  state_id: number;
  name: string;
};

@injectable()
export class UpdateCityUseCase {
  constructor(
    @inject("CityRepository")
    private citiesRepository: ICityRepository,

    @inject("StatesRepository")
    private statesRepository: IStatesRepository
  ) {}

  async execute({ id, state_id, name }: IRequest): Promise<City> {
    const city = await this.citiesRepository.findById(id);
    if (!city) {
      throw new AppError("City not found", 404, "CITY_NOT_FOUND");
    }

    const state = await this.statesRepository.findById(state_id);
    if (!state) {
      throw new AppError("State not found", 404, "STATE_NOT_FOUND");
    }

    const normalized = name.trim();

    const conflict = await this.citiesRepository.findByNameInState(state_id, normalized);
    if (conflict && conflict.id !== id) {
      throw new AppError("City name already in use in this state", 409, "CITY_NAME_CONFLICT");
    }

    return this.citiesRepository.update({ id, state_id, name: normalized });
  }
}

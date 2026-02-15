import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { ICityRepository } from "../repositories/ICityRepository";

@injectable()
export class DeleteCityUseCase {
  constructor(
    @inject("CityRepository")
    private citiesRepository: ICityRepository
  ) {}

  async execute(id: number): Promise<void> {
    const city = await this.citiesRepository.findById(id);
    if (!city) {
      throw new AppError("City not found", 404, "CITY_NOT_FOUND");
    }

    await this.citiesRepository.delete(id);
  }
}

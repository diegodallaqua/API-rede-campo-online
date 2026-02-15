import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IStatesRepository } from "../repositories/IStatesRepository";

@injectable()
export class DeleteStateUseCase {
  constructor(
    @inject("StatesRepository")
    private statesRepository: IStatesRepository
  ) {}

  async execute(id: number): Promise<void> {
    const state = await this.statesRepository.findById(id);
    if (!state) {
      throw new AppError("State not found", 404, "STATE_NOT_FOUND");
    }

    await this.statesRepository.delete(id);
  }
}

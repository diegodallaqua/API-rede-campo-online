import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { State } from "../entities/State";
import { IStatesRepository } from "../repositories/IStatesRepository";

interface IRequest {
  id: number;
  name: string;
}

@injectable()
export class UpdateStateUseCase {
  constructor(
    @inject("StatesRepository")
    private statesRepository: IStatesRepository
  ) {}

  async execute({ id, name }: IRequest): Promise<State> {
    const state = await this.statesRepository.findById(id);
    if (!state) {
      throw new AppError("State not found", 404, "STATE_NOT_FOUND");
    }

    const normalized = name.trim();

    const conflict = await this.statesRepository.findByName(normalized);
    if (conflict && conflict.id !== id) {
      throw new AppError("State name already in use", 409, "STATE_NAME_CONFLICT");
    }

    return this.statesRepository.update({ id, name: normalized });
  }
}

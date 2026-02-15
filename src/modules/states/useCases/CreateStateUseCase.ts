import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { State } from "../entities/State";
import { IStatesRepository } from "../repositories/IStatesRepository";

interface IRequest {
  name: string;
}

@injectable()
export class CreateStateUseCase {
  constructor(
    @inject("StatesRepository")
    private statesRepository: IStatesRepository
  ) {}

  async execute({ name }: IRequest): Promise<State> {
    const normalized = name.trim();

    const existing = await this.statesRepository.findByName(normalized);
    if (existing) {
      throw new AppError("State already exists", 409, "STATE_ALREADY_EXISTS");
    }

    return this.statesRepository.create({ name: normalized });
  }
}
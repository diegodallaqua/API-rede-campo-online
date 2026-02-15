import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCityUseCase } from "../../useCases/CreateCityUseCase";

export class CreateCityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { state_id, name } = req.body;

    const useCase = container.resolve(CreateCityUseCase);
    const city = await useCase.execute({ state_id, name });

    return res.status(201).json(city);
  }
}

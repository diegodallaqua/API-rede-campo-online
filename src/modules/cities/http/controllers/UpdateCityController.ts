import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCityUseCase } from "../../useCases/UpdateCityUseCase";

export class UpdateCityController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const { state_id, name } = req.body;

    const useCase = container.resolve(UpdateCityUseCase);
    const city = await useCase.execute({ id, state_id, name });

    return res.json(city);
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateStateUseCase } from "../../useCases/UpdateStateUseCase";

export class UpdateStateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const { name } = req.body;

    const useCase = container.resolve(UpdateStateUseCase);
    const state = await useCase.execute({ id, name });

    return res.json(state);
  }
}

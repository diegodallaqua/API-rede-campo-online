import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateStateUseCase } from "../../useCases/CreateStateUseCase";

export class CreateStateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;

    const useCase = container.resolve(CreateStateUseCase);
    const state = await useCase.execute({ name });

    return res.status(201).json(state);
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateProjectMediaUseCase } from "../../useCases/CreateProjectMediaUseCase";

export class CreateProjectMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateProjectMediaUseCase);
    const created = await useCase.execute(req.body);
    return res.status(201).json(created);
  }
}
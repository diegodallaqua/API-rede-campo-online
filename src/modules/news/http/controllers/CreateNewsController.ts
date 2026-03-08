import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateNewsUseCase } from "../../useCases/CreateNewsUseCase";

export class CreateNewsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateNewsUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "News created" });
  }
}
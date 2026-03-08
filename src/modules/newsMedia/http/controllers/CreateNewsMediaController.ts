import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateNewsMediaUseCase } from "../../useCases/CreateNewsMediaUseCase";

export class CreateNewsMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateNewsMediaUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "News media created" });
  }
}
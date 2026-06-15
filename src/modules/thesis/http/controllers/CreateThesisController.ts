import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateThesisUseCase } from "../../useCases/CreateThesisUseCase";

export class CreateThesisController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateThesisUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Thesis created" });
  }
}

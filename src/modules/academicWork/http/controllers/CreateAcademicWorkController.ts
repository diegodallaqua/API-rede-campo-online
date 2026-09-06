import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateAcademicWorkUseCase } from "../../useCases/CreateAcademicWorkUseCase";

export class CreateAcademicWorkController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateAcademicWorkUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Academic work created" });
  }
}

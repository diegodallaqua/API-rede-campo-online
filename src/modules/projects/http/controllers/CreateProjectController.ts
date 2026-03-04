import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateProjectUseCase } from "../../useCases/CreateProjectUseCase";

export class CreateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateProjectUseCase);
    await useCase.execute(req.body);
    return res.status(201).json({ message: "Project created" });
  }
}
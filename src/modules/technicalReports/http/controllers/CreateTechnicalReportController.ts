import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTechnicalReportUseCase } from "../../useCases/CreateTechnicalReportUseCase";

export class CreateTechnicalReportController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateTechnicalReportUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Technical report created" });
  }
}
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateTechnicalReportUseCase } from "../../useCases/UpdateTechnicalReportUseCase";

export class UpdateTechnicalReportController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(UpdateTechnicalReportUseCase);
    await useCase.execute({
      publication_id,
      ...req.body,
    });

    return res.json({ message: "Technical report updated" });
  }
}
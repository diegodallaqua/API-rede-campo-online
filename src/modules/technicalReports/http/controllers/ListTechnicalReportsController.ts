import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListTechnicalReportsUseCase } from "../../useCases/ListTechnicalReportsUseCase";

export class ListTechnicalReportsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const title =
      typeof req.query.title === "string" ? req.query.title : undefined;

    const organization_id = req.query.organization_id !== undefined ? Number(req.query.organization_id) : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListTechnicalReportsUseCase);
    const result = await useCase.execute({
      title,
      organization_id,
      page,
      take,
    });

    return res.json(result);
  }
}
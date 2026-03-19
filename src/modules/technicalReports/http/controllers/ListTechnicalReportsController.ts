import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListTechnicalReportsUseCase } from "../../useCases/ListTechnicalReportsUseCase";

export class ListTechnicalReportsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const title =
      typeof req.query.title === "string" ? req.query.title : undefined;

    const organization_id =
      typeof req.query.organization_id === "number"
        ? req.query.organization_id
        : typeof req.query.organization_id === "string"
        ? Number(req.query.organization_id)
        : undefined;

    const page =
      typeof req.query.page === "number"
        ? req.query.page
        : typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const take =
      typeof req.query.take === "number"
        ? req.query.take
        : typeof req.query.take === "string"
        ? Number(req.query.take)
        : 10;

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
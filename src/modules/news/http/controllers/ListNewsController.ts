import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListNewsUseCase } from "../../useCases/ListNewsUseCase";

export class ListNewsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const project_id = req.query.project_id !== undefined ? Number(req.query.project_id) : undefined;

    const useCase = container.resolve(ListNewsUseCase);

    const result = await useCase.execute({
      search,
      page,
      take,
      project_id,
    });

    return res.json(result);
  }
}
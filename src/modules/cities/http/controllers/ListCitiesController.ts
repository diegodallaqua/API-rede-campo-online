import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCitiesUseCase } from "../../useCases/ListCitiesUseCase";

export class ListCitiesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const state_id = req.query.state_id !== undefined ? Number(req.query.state_id) : undefined;

    const useCase = container.resolve(ListCitiesUseCase);
    const result = await useCase.execute({ search, page, take, state_id });

    return res.json(result);
  }
}

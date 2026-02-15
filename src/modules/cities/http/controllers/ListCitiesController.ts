import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCitiesUseCase } from "../../useCases/ListCitiesUseCase";

export class ListCitiesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const take = typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const state_id =
      typeof req.query.state_id === "string" ? Number(req.query.state_id) : undefined;

    const useCase = container.resolve(ListCitiesUseCase);
    const result = await useCase.execute({ search, page, take, state_id });

    return res.json(result);
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListNewsUseCase } from "../../useCases/ListNewsUseCase";

export class ListNewsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

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

    const project_id =
      typeof req.query.project_id === "number"
        ? req.query.project_id
        : typeof req.query.project_id === "string"
        ? Number(req.query.project_id)
        : undefined;

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
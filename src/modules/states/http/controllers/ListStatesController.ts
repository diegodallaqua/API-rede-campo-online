import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListStatesUseCase } from "../../useCases/ListStatesUseCase";

export class ListStatesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListStatesUseCase);

    const result = await useCase.execute({
      search,
      page,
      take,
    });

    return res.json(result);
  }
}
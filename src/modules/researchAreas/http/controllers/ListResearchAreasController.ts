import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListResearchAreasUseCase } from "../../useCases/ListResearchAreasUseCase";

export class ListResearchAreasController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListResearchAreasUseCase);

    const result = await useCase.execute({
      search,
      page,
      take,
    });

    return res.json(result);
  }
}

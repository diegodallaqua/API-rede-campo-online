import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesUseCase } from "../../useCases/ListArticlesUseCase";

export class ListArticlesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const title =
      typeof req.query.title === "string" ? req.query.title : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListArticlesUseCase);
    const result = await useCase.execute({
      title,
      page,
      take,
    });

    return res.json(result);
  }
}
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListNewsMediaUseCase } from "../../useCases/ListNewsMediaUseCase";

export class ListNewsMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

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

    const news_id =
      typeof req.query.news_id === "number"
        ? req.query.news_id
        : typeof req.query.news_id === "string"
        ? Number(req.query.news_id)
        : undefined;

    const useCase = container.resolve(ListNewsMediaUseCase);
    const result = await useCase.execute({
      search,
      page,
      take,
      news_id,
    });

    return res.json(result);
  }
}
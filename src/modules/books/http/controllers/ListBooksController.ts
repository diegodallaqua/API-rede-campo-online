import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListBooksUseCase } from "../../useCases/ListBooksUseCase";

export class ListBooksController {
  async handle(req: Request, res: Response): Promise<Response> {
    const title =
      typeof req.query.title === "string" ? req.query.title : undefined;

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

    const useCase = container.resolve(ListBooksUseCase);
    const result = await useCase.execute({
      title,
      page,
      take,
    });

    return res.json(result);
  }
}
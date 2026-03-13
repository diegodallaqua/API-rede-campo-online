import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListExternalAuthorsUseCase } from "../../useCases/ListExternalAuthorsUseCase";

export class ListExternalAuthorsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const name =
      typeof req.query.name === "string" ? req.query.name : undefined;

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

    const useCase = container.resolve(ListExternalAuthorsUseCase);

    const result = await useCase.execute({
      name,
      page,
      take,
    });

    return res.json(result);
  }
}
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListPublicationContributorsUseCase } from "../../useCases/ListPublicationContributorsUseCase";

export class ListPublicationContributorsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id =
      typeof req.query.publication_id === "number"
        ? req.query.publication_id
        : typeof req.query.publication_id === "string"
        ? Number(req.query.publication_id)
        : undefined;

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

    const useCase = container.resolve(ListPublicationContributorsUseCase);
    const result = await useCase.execute({
      publication_id,
      page,
      take,
    });

    return res.json(result);
  }
}
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListPublicationContributorsUseCase } from "../../useCases/ListPublicationContributorsUseCase";

export class ListPublicationContributorsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = req.query.publication_id !== undefined ? Number(req.query.publication_id) : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListPublicationContributorsUseCase);
    const result = await useCase.execute({
      publication_id,
      page,
      take,
    });

    return res.json(result);
  }
}
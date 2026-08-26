import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProjectPublicationsUseCase } from "../../useCases/ListProjectPublicationsUseCase";

export class ListProjectPublicationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const project_id = Number(req.params.id);

    const title =
      typeof req.query.title === "string" ? req.query.title : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;

    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListProjectPublicationsUseCase);

    const result = await useCase.execute({
      project_id,
      title,
      page,
      take,
    });

    return res.json(result);
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProjectsUseCase } from "../../useCases/ListProjectsUseCase";

export class ListProjectsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const project_name = typeof req.query.project_name === "string" ? req.query.project_name : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status === "true"
          ? true
          : req.query.status === "false"
            ? false
            : undefined
        : typeof req.query.status === "boolean"
          ? req.query.status
          : undefined;

    const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const take = typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListProjectsUseCase);

    const result = await useCase.execute({
      page,
      take,
      project_name,
      status,
    });

    return res.json(result);
  }
}
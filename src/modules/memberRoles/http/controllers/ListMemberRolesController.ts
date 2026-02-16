import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMemberRolesUseCase } from "../../useCases/ListMemberRolesUseCase";

export class ListMemberRolesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const take =
      typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const useCase = container.resolve(ListMemberRolesUseCase);

    const result = await useCase.execute({
      search,
      page,
      take,
    });

    return res.json(result);
  }
}

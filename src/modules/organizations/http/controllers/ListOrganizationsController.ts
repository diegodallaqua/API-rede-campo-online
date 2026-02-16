import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListOrganizationsUseCase } from "../../useCases/ListOrganizationsUseCase";

export class ListOrganizationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const take = typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const address_id =
      typeof req.query.address_id === "string" ? Number(req.query.address_id) : undefined;

    const useCase = container.resolve(ListOrganizationsUseCase);
    const result = await useCase.execute({ search, page, take, address_id });

    return res.json(result);
  }
}

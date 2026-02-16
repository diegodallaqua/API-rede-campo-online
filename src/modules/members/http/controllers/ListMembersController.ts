import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMembersUseCase } from "../../useCases/ListMembersUseCase";

export class ListMembersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const take = typeof req.query.take === "string" ? Number(req.query.take) : 10;

    const member_role_id =
      typeof req.query.member_role_id === "string" ? Number(req.query.member_role_id) : undefined;

    const organization_id =
      typeof req.query.organization_id === "string" ? Number(req.query.organization_id) : undefined;

    const useCase = container.resolve(ListMembersUseCase);
    const result = await useCase.execute({ search, page, take, member_role_id, organization_id });

    return res.json(result);
  }
}

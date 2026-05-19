import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMembersUseCase } from "../../useCases/ListMembersUseCase";

export class ListMembersController {
  async handle(req: Request, res: Response): Promise<Response> {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const take = req.query.take !== undefined ? Number(req.query.take) : 10;

    const member_role_id = req.query.member_role_id !== undefined ? Number(req.query.member_role_id) : undefined;

    const organization_id = req.query.organization_id !== undefined ? Number(req.query.organization_id) : undefined;

    const useCase = container.resolve(ListMembersUseCase);
    const result = await useCase.execute({ search, page, take, member_role_id, organization_id });

    return res.json(result);
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateOrganizationUseCase } from "../../useCases/UpdateOrganizationUseCase";

export class UpdateOrganizationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdateOrganizationUseCase);
    const org = await useCase.execute({ id, ...req.body });

    return res.json(org);
  }
}

import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateOrganizationUseCase } from "../../useCases/CreateOrganizationUseCase";

export class CreateOrganizationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateOrganizationUseCase);
    const org = await useCase.execute(req.body);
    return res.status(201).json(org);
  }
}

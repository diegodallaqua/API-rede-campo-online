import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateMemberUseCase } from "../../useCases/AuthenticateMemberUseCase";

export class SessionsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const useCase = container.resolve(AuthenticateMemberUseCase);
    const result = await useCase.execute({ email, password });

    return res.json(result);
  }
}

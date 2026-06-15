import { Request, Response } from "express";
import { container } from "tsyringe";
import { LogoutUseCase } from "../../useCases/LogoutUseCase";

export class LogoutController {
  async handle(req: Request, res: Response): Promise<Response> {
    const [, token] = req.headers.authorization!.split(" ");
    const useCase = container.resolve(LogoutUseCase);
    await useCase.execute({ token });
    return res.status(204).send();
  }
}

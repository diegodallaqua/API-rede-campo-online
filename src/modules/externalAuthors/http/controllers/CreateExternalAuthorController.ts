import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateExternalAuthorUseCase } from "../../useCases/CreateExternalAuthorUseCase";

export class CreateExternalAuthorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateExternalAuthorUseCase);
    const externalAuthor = await useCase.execute(req.body);

    return res.status(201).json(externalAuthor);
  }
}
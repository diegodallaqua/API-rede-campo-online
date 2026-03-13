import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateExternalAuthorUseCase } from "../../useCases/UpdateExternalAuthorUseCase";

export class UpdateExternalAuthorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdateExternalAuthorUseCase);
    const externalAuthor = await useCase.execute({
      id,
      ...req.body,
    });

    return res.json(externalAuthor);
  }
}
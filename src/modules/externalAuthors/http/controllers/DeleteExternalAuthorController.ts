import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteExternalAuthorUseCase } from "../../useCases/DeleteExternalAuthorUseCase";

export class DeleteExternalAuthorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeleteExternalAuthorUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}
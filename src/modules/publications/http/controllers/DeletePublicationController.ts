import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeletePublicationUseCase } from "../../useCases/DeletePublicationUseCase";

export class DeletePublicationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeletePublicationUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}
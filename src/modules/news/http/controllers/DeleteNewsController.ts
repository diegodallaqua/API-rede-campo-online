import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteNewsUseCase } from "../../useCases/DeleteNewsUseCase";

export class DeleteNewsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeleteNewsUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}
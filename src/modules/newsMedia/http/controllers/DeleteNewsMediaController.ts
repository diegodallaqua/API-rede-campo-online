import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteNewsMediaUseCase } from "../../useCases/DeleteNewsMediaUseCase";

export class DeleteNewsMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeleteNewsMediaUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}
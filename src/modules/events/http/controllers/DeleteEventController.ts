import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteEventUseCase } from "../../useCases/DeleteEventUseCase";

export class DeleteEventController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(DeleteEventUseCase);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
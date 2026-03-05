import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteEventMediaUseCase } from "../../useCases/DeleteEventMediaUseCase";

export class DeleteEventMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(DeleteEventMediaUseCase);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
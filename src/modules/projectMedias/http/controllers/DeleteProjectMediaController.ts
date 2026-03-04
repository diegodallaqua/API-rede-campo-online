import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteProjectMediaUseCase } from "../../useCases/DeleteProjectMediaUseCase";

export class DeleteProjectMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(DeleteProjectMediaUseCase);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
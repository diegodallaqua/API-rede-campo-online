import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteProjectUseCase } from "../../useCases/DeleteProjectUseCase";

export class DeleteProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(DeleteProjectUseCase);
    await useCase.execute(id);
    return res.status(204).send();
  }
}
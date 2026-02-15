import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteStateUseCase } from "../../useCases/DeleteStateUseCase";

export class DeleteStateController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(DeleteStateUseCase);
    await useCase.execute(id);

    return res.status(204).send();
  }
}

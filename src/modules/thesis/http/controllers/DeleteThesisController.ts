import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteThesisUseCase } from "../../useCases/DeleteThesisUseCase";

export class DeleteThesisController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(DeleteThesisUseCase);
    await useCase.execute(publication_id);

    return res.status(204).send();
  }
}

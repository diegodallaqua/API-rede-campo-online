import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteBookUseCase } from "../../useCases/DeleteBookUseCase";

export class DeleteBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(DeleteBookUseCase);
    await useCase.execute(publication_id);

    return res.status(204).send();
  }
}
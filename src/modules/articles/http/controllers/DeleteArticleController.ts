import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteArticleUseCase } from "../../useCases/DeleteArticleUseCase";

export class DeleteArticleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(DeleteArticleUseCase);
    await useCase.execute(publication_id);

    return res.status(204).send();
  }
}
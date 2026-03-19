import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeletePublicationContributorUseCase } from "../../useCases/DeletePublicationContributorUseCase";

export class DeletePublicationContributorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);
    const author_order = Number(req.params.author_order);

    const useCase = container.resolve(DeletePublicationContributorUseCase);
    await useCase.execute(publication_id, author_order);

    return res.status(204).send();
  }
}
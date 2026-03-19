import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdatePublicationContributorUseCase } from "../../useCases/UpdatePublicationContributorUseCase";

export class UpdatePublicationContributorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);
    const current_author_order = Number(req.params.author_order);

    const useCase = container.resolve(UpdatePublicationContributorUseCase);
    await useCase.execute({
      publication_id,
      current_author_order,
      ...req.body,
    });

    return res.json({ message: "Publication contributor updated" });
  }
}
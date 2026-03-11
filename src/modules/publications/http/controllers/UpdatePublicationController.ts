import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdatePublicationUseCase } from "../../useCases/UpdatePublicationUseCase";

export class UpdatePublicationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdatePublicationUseCase);
    const publication = await useCase.execute({
      id,
      ...req.body,
    });

    return res.json(publication);
  }
}
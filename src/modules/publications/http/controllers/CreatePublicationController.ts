import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePublicationUseCase } from "../../useCases/CreatePublicationUseCase";

export class CreatePublicationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreatePublicationUseCase);
    const publication = await useCase.execute(req.body);

    return res.status(201).json(publication);
  }
}
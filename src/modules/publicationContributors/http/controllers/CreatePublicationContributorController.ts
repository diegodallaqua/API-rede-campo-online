import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePublicationContributorUseCase } from "../../useCases/CreatePublicationContributorUseCase";

export class CreatePublicationContributorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreatePublicationContributorUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Publication contributor created" });
  }
}
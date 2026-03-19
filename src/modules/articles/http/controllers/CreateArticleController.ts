import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateArticleUseCase } from "../../useCases/CreateArticleUseCase";

export class CreateArticleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateArticleUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Article created" });
  }
}
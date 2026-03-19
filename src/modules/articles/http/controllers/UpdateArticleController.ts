import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateArticleUseCase } from "../../useCases/UpdateArticleUseCase";

export class UpdateArticleController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(UpdateArticleUseCase);
    await useCase.execute({
      publication_id,
      ...req.body,
    });

    return res.json({ message: "Article updated" });
  }
}
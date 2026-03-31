import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateBookChapterUseCase } from "../../useCases/UpdateBookChapterUseCase";

export class UpdateBookChapterController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(UpdateBookChapterUseCase);
    await useCase.execute({
      publication_id,
      ...req.body,
    });

    return res.json({ message: "Book chapter updated" });
  }
}
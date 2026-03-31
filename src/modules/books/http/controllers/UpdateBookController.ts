import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateBookUseCase } from "../../useCases/UpdateBookUseCase";

export class UpdateBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(UpdateBookUseCase);
    await useCase.execute({
      publication_id,
      ...req.body,
    });

    return res.json({ message: "Book updated" });
  }
}
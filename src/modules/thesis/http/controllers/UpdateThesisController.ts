import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateThesisUseCase } from "../../useCases/UpdateThesisUseCase";

export class UpdateThesisController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(UpdateThesisUseCase);
    await useCase.execute({
      publication_id,
      ...req.body,
    });

    return res.json({ message: "Thesis updated" });
  }
}

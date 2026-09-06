import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAcademicWorkUseCase } from "../../useCases/UpdateAcademicWorkUseCase";

export class UpdateAcademicWorkController {
  async handle(req: Request, res: Response): Promise<Response> {
    const publication_id = Number(req.params.publication_id);

    const useCase = container.resolve(UpdateAcademicWorkUseCase);
    await useCase.execute({
      publication_id,
      ...req.body,
    });

    return res.json({ message: "Academic work updated" });
  }
}

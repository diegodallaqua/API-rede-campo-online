import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNewsUseCase } from "../../useCases/UpdateNewsUseCase";

export class UpdateNewsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdateNewsUseCase);
    await useCase.execute({
      id,
      ...req.body,
    });

    return res.json({ message: "News updated" });
  }
}
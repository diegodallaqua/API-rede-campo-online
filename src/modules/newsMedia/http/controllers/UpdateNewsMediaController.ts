import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateNewsMediaUseCase } from "../../useCases/UpdateNewsMediaUseCase";

export class UpdateNewsMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    const useCase = container.resolve(UpdateNewsMediaUseCase);
    await useCase.execute({
      id,
      ...req.body,
    });

    return res.json({ message: "News media updated" });
  }
}
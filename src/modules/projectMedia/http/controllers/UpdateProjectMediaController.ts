import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateProjectMediaUseCase } from "../../useCases/UpdateProjectMediaUseCase";

export class UpdateProjectMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(UpdateProjectMediaUseCase);
    const updated = await useCase.execute({ id, ...req.body });
    return res.json(updated);
  }
}
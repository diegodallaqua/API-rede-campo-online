import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateProjectUseCase } from "../../useCases/UpdateProjectUseCase";

export class UpdateProjectController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(UpdateProjectUseCase);
    await useCase.execute({ id, ...req.body });
    return res.json({ message: "Project updated" });
  }
}
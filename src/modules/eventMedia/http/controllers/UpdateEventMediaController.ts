import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateEventMediaUseCase } from "../../useCases/UpdateEventMediaUseCase";

export class UpdateEventMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(UpdateEventMediaUseCase);
    await useCase.execute({ id, ...req.body });
    return res.json({ message: "Event media updated" });
  }
}
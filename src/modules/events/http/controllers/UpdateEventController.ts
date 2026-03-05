import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateEventUseCase } from "../../useCases/UpdateEventUseCase";

export class UpdateEventController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const useCase = container.resolve(UpdateEventUseCase);
    await useCase.execute({ id, ...req.body });
    return res.json({ message: "Event updated" });
  }
}
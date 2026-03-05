import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateEventUseCase } from "../../useCases/CreateEventUseCase";

export class CreateEventController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateEventUseCase);
    await useCase.execute(req.body);
    return res.status(201).json({ message: "Event created" });
  }
}
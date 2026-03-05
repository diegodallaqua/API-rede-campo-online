import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateEventMediaUseCase } from "../../useCases/CreateEventMediaUseCase";

export class CreateEventMediaController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateEventMediaUseCase);
    await useCase.execute(req.body);
    return res.status(201).json({ message: "Event media created" });
  }
}
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateBookUseCase } from "../../useCases/CreateBookUseCase";

export class CreateBookController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateBookUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Book created" });
  }
}
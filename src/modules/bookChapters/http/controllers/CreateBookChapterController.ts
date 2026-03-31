import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateBookChapterUseCase } from "../../useCases/CreateBookChapterUseCase";

export class CreateBookChapterController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateBookChapterUseCase);
    await useCase.execute(req.body);

    return res.status(201).json({ message: "Book chapter created" });
  }
}
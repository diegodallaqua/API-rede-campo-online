import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMemberUseCase } from "../../useCases/CreateMemberUseCase";

export class CreateMemberController {
  async handle(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateMemberUseCase);
    await useCase.execute(req.body);
    return res.status(201).json({ message: "Member created" });
  }
}
